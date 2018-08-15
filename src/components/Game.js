import React, { Component, Fragment } from 'react';
import { ActionCable } from 'react-actioncable-provider';
import { connect } from 'react-redux';
import { API_WS_ROOT, HEADERS, UPDATE_USER_STATUS, PICK_MAFIA, UPDATE_LOBBY_PROTECTION, KILL_VICTIM, CAST_VOTE } from '../constants/api-endpoints'

import MafiaKill from './game/MafiaKill'
import TownsfolkSleep from './game/TownsfolkSleep'
import TownsfolkTurn from './game/TownsfolkTurn'
import Dead from './game/Dead'

//rerender occurs on change of redux as user?

class Game extends Component {
  state = {
    openGame: false,
    log: "",
    alive: true
  }

  componentDidMount = () => {
    //if the mafia does not exist, get one
    if(!this.props.mafiaExists) {
      this.getRandomMafia()
    }
  }

  getRandomMafia = () => {
    //let the host send out mafia request
    if(this.props.isHost) {
      let randInt = Math.floor(Math.random() * this.props.users.length)
      let mafiaId = this.props.users[randInt].id
      setTimeout(() => fetch(PICK_MAFIA, {
        method: 'POST',
        headers: HEADERS,
        body: JSON.stringify({
          lobby_id: this.props.lobbyId,
          mafia_id: mafiaId
        })
      }), 3000)
    }
  }

  handleKillVictim = (event) => {
    //grab victim's username
    let victimUsername = event.target.innerText
    //find victim obj and set his status to dead
    let victimObj = this.props.users.filter(user => user.username === victimUsername)[0]
    //get the ID and broadcast out the id of the victim that will be terminated
    let victimId = victimObj.id

    //this will broadcast out to all users the victim
    fetch(KILL_VICTIM, {
      method: 'POST',
      headers: HEADERS,
      body: JSON.stringify({
        lobby_id: this.props.lobbyId,
        victim_id: victimId
      })
    })
  }

  //Townsfolk & mafia votes are sent through here
  castVote = (event, incomingVoteUsername) => {
    let voteObj = this.props.users.filter(user => user.username === incomingVoteUsername)[0]
    let voteId = voteObj.id

    //this will broadcast out to all other voters
    fetch(CAST_VOTE, {
      method: 'POST',
      headers: HEADERS,
      body: JSON.stringify({
        lobby_id: this.props.lobbyId,
        voter_id: this.props.user.id,
        recipient_id: voteId
      })
    })

  }

  handleIncomingVote = (voter, recipient) => {
    //send back the voter, and who they voted for
    console.log(`${voter} thinks that ${recipient.username} is the mafia`)
  }


  //this function updates the redux state of all players to exclude killed victim
  updateKilledVictim = (victim) => {
    victim.alive = false
    //for loop makes updatedList that replaces alive victim with dead victim
    let updatedUsers = this.props.users
    let i;
    for(i = 0; i < updatedUsers.length; i++) {
      if(updatedUsers[i].id === victim.id) {
        updatedUsers[i] = victim
      }
    }

    //here we are going to need to update the redux of all users, to persist the kill
    this.props.updateUsersAfterKill(updatedUsers)
    //we also need to check if the passed in victim is the client, in that case we must update their state
    if(victim.id === this.props.user.id) {
      this.setState({
        alive: false
      })
    }
    //finally we must switch the turn to the townsfolk
    this.props.setTurn('townsfolk')
  }

  //rendered when it is the MAFIA's turn
  renderMafiaTurn = () => {
    //if you are the mafia, render mafia selection
    if(this.props.user.role === 'mafia') {
      return <MafiaKill killVictim={this.handleKillVictim}/>
    //else, render sleep turn for townsfolk
    } else {
      return <TownsfolkSleep />
    }
  }

  //controls the logic of the game entirely
  renderGame = () => {
    //render alive components
    if(this.state.alive) {
      if(this.state.openGame || this.props.user.role === 'mafia') {
        if(this.props.turn === 'mafia') {
          return this.renderMafiaTurn()
        } else {
          return this.renderTownsfolkTurn()
        }
      } else {
        //between the time we are selecting the mafia
        return <div>Selecting Mafia</div>
      }
    } else {
      //your dead render that
      return <Dead />
    }
  }

  renderTownsfolkTurn = () => {
    return <TownsfolkTurn vote={this.castVote}/>
  }

  //all game updates come from here
  updateGame = response => {
    const { type } = response;

    //all broadcasts must include a 'type'
    switch(type) {
      //in the case of mafia_selection, we are setting the mafia
      case "mafia_selection":
        if(response.mafia.username === this.props.user.username) {
          this.props.setRole("mafia")
        }
        this.setState({
          openGame: true
        })
        //mafia now exists
        this.props.setMafiaExists(true)
        break;

      //mafia has selected someone to kill, update accordingly (this will also trigger a turn change)
      case "KILL":
        this.updateKilledVictim(response.victim)
        break;
      //user disconnects, handle this on front end
      case "DC_USER":
        this.props.setUsers(response.updated_users)
        if(response.user.role === "mafia") {
          // window.close()
        } else {
          this.setState({
            log: `${response.user.username} has disconnected.`
          })
        }
        break;
      case "CAST_VOTE":
        this.handleIncomingVote(response.voter_id, response.recipient)
        break;
    }
  }

  render() {
    return(
      <Fragment>
        <ActionCable
          channel={{channel: 'LobbiesChannel', lobby_id: this.props.lobbyId, user_id: this.props.user.id}}
          onReceived={this.updateGame}
        />
        {this.renderGame()}
      </Fragment>
    )
  }
}


function msp(state) {
  return {
    lobbyName: state.lobbyName,
    lobbyId: state.lobbyId,
    username: state.username,
    users: state.users,
    user: state.user,
    isHost: state.isHost,
    turn: state.turn,
    mafiaExists: state.mafiaExists
  }
}

function mdp(dispatch) {
  return {
    addLobbyName: (name) => {
      dispatch({type: "ADD_LOBBY_NAME", payload: name})
    },
    addLobbyPassword: (password) => {
      dispatch({type: "ADD_LOBBY_PASSWORD", payload: password})
    },
    openLobby: () => {
      dispatch({type: "OPEN_LOBBY"})
    },
    setUsers: (users) => {
      dispatch({type: "SET_USERS", payload: users})
    },
    setRole: (role) => {
      dispatch({type: "SET_ROLE", payload: role})
    },
    setTurn: (type) => {
      dispatch({type: "SET_TURN", payload: type})
    },
    setMafiaExists: (bool) => {
      dispatch({type: "MAFIA_EXISTS", payload: bool})
    },
    updateUsersAfterKill: (users) => {
      dispatch({type: "KILL_VICTIM", payload: users})
    },
    userDied: () => {
      dispatch({type: "USER_DIED"})
    }
  }
}


export default connect(msp, mdp)(Game)
