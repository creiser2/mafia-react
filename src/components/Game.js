import React, { Component, Fragment } from 'react';
import { ActionCable } from 'react-actioncable-provider';
import { connect } from 'react-redux';
import { API_WS_ROOT, HEADERS, UPDATE_USER_STATUS, PICK_MAFIA, UPDATE_LOBBY_PROTECTION, KILL_VICTIM, CAST_VOTE } from '../constants/api-endpoints'

//components
import MafiaKill from './game/MafiaKill'
import TownsfolkSleep from './game/TownsfolkSleep'
import TownsfolkTurn from './game/TownsfolkTurn'
import Dead from './game/Dead'
import WaitForVotes from './game/WaitForVotes'
import TownsfolkWin from './game/TownsfolkWin'
import TownsfolkLose from './game/TownsfolkLose'
import MafiaLose from './game/MafiaLose'
import MafiaWin from './game/MafiaWin'
import SelectingMafia from './game/SelectingMafia'


class Game extends Component {
  state = {
    openGame: false,
    log: "",
    alive: true,
    voted: false,
    voteCount: 0,
    mafiaDead: false,
    mafiaWon: false,
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

  //called when mafioso selects who to kill
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
        victim_id: victimId,
        turn: 'townsfolk'
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

    //LEFTOFF dont render townsfolk pg at this pt
    this.setState({
      voted: true
    })
  }

  handleIncomingVote = (voterId, recipient) => {
    //maybe do something with voter ID later, but
    //vote structure will be like {recipient.username: VOTE_COUNT}
    let voter = this.props.users.find(user => user.id == voterId)
    let voterUsername = voter.username
    let updatedVotes = this.props.votes
    let voteObj = {recipientId: recipient.id, recipientUsername: recipient.username, count: count}

    let count = 0;
    let i=0;

    //function constructs voter object
    if(this.props.votes.length > 0) {
      for(i=0; i<this.props.votes.length; i++) {
        if(updatedVotes[i].recipientId === recipient.id) {
          updatedVotes[i].count += 1
          break;
        } else if(i === updatedVotes.length-1) {
          updatedVotes.push({recipientId: recipient.id, recipientUsername: recipient.username, count: 1})
          break;
        }
      }
    } else {
      updatedVotes.push({recipientId: recipient.id, recipientUsername: recipient.username, count: 1})
    }
    this.props.updateVotes(updatedVotes)

    //increment total votes for round by 1
    this.setState({
      voteCount: this.state.voteCount + 1
    })

    //check to see if voting is over with
    if(this.getAlivePlayers().length === this.state.voteCount) {
      //kill the suspect who was most voted for
      this.killSuspect()
    }
  }

  //get a list of players who's alive boolean is true
  getAlivePlayers = () => {
    return this.props.users.filter(user => user.alive)
  }

  //tally votes and decide who the townsfolk want to eliminate
  killSuspect = () => {
    //tied detects if there is a tie in the votes
    let popularVote = this.findPopularVote()
    let votes = this.props.votes

    //check to see if there's a tie
    let u=0;
    for(u=0; u<votes.length; u++) {
      if(votes[u].count === popularVote.vote.count && votes[u] !== popularVote.vote) {
        popularVote.tied = true
      }
    }

    //if there's a tie, townsfolk can't kill anyone
    if(popularVote.tied) {
      console.log("TIE")
      this.props.clearVotes()
      this.props.setTurn('mafia')

      this.setState({
        voteCount: 0,
        voted: false,
      })
      //only mafia will broadcast kill bc they must be living at this point
    } else if(this.props.user.role === 'mafia') {
      //this will broadcast out to all users the victim
      fetch(KILL_VICTIM, {
        method: 'POST',
        headers: HEADERS,
        body: JSON.stringify({
          lobby_id: this.props.lobbyId,
          victim_id: popularVote.vote.recipientId,
          turn: 'mafia'
        })
      }).then(response => {
        this.props.clearVotes()

        this.setState({
          voteCount: 0,
          voted: false,
        })
      })
    }
    else {
      this.props.clearVotes()
      this.props.setTurn('mafia')

      this.setState({
        voteCount: 0,
        voted: false,
      })
    }
  }

  //iterate through list and find most popular vote
  findPopularVote = () => {
    let popularVote = {vote: this.props.votes[0], tied: false}
    let votes = this.props.votes

    //pick out the most popular vote
    let i=0;
    for(i=0; i<votes.length; i++) {
      if(votes[i].count > popularVote.vote.count) {
        popularVote.vote = votes[i]
      }
    }

    return popularVote
  }

  //if the victim is the mafia, set state accordingly
  checkVictimMafia = (victim) => {
    //townsfolk successfully kill mafia
    if(victim.role === 'mafia') {
      this.setState({
        mafiaDead: true
      })
    }
  }

  //this function updates the redux state of all players to exclude killed victim
  updateKilledVictim = (victim, incomingTurn) => {
    victim.alive = false

    //checks to see if mafia is dead
    this.checkVictimMafia(victim)

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

    //checks to see if mafia has won
    this.checkMafiaWin()

    //finally we must switch the turn to the townsfolk
    this.props.setTurn(incomingTurn)
  }

  //rendered when it is the MAFIA's turn
  renderMafiaTurn = () => {
    //if you are the mafia, render mafia selection
    if(this.props.user.role === 'mafia') {
      return <MafiaKill killVictim={this.handleKillVictim} alivePlayers={this.getAlivePlayers()}/>
    //else, render sleep turn for townsfolk
    } else {
      return <TownsfolkSleep />
    }
  }

  //basically the mafia wins when there are only 2 people left because he can kill the last person
  checkMafiaWin = () => {
    if(this.getAlivePlayers().length <= 2) {
      this.setState({
        mafiaWon: true
      })
    }
  }

  //controls the logic of the game entirely
  renderGame = () => {
    //render game components
    if(!this.state.mafiaDead) {
      if(!this.state.mafiaWon) {
        if(this.state.alive) {
          if(this.state.openGame || this.props.user.role === 'mafia') {
            if(this.props.turn === 'mafia') {
              return this.renderMafiaTurn()
              //if tf turn and haven't voted
            } else if(!this.state.voted) {
              return this.renderTownsfolkTurn()
              //if tf turn and have voted (waiting)
            } else {
              return <WaitForVotes />
            }
          } else {
            //between the time we are selecting the mafia
            return <SelectingMafia />
          }
        } else {
          //your dead render that
          return <Dead />
        } //mafia has won
      } else {
        if(this.props.user.role !== 'mafia') {
          //set state to game over
          return <TownsfolkLose />
        } else {
          return <MafiaWin player={this.props.user.username}/>
        }
      }
    } else {
      //mafia is dead
      if(this.props.user.role !== 'mafia') {
        return <TownsfolkWin />
      } else {
        return <MafiaLose />
      }
    }
  }

  //unprotect the lobby
  updateLobbyProtection = () => {
    fetch(`${UPDATE_LOBBY_PROTECTION}` + this.props.lobbyId, {
      method: 'PUT',
      headers: HEADERS,
      body: JSON.stringify({
        id: this.props.lobbyId,
        protected: false
      })
    })
  }


  renderTownsfolkTurn = () => {
    return <TownsfolkTurn vote={this.castVote} votes={this.state.votes}/>
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
          //allow disconnections in lobby to exist
          this.updateLobbyProtection()
        }
        this.setState({
          openGame: true
        })
        //mafia now exists
        this.props.setMafiaExists(true)

        break;

      //mafia has selected someone to kill, update accordingly (this will also trigger a turn change)
      case "KILL":
        this.updateKilledVictim(response.victim, response.turn)
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
    mafiaExists: state.mafiaExists,
    votes: state.votes
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
    },
    updateVotes: (votes) => {
      dispatch({type: "CAST_VOTE", payload: votes})
    },
    clearVotes: () => {
      dispatch({type: "CLEAR_VOTES"})
    }
  }
}


export default connect(msp, mdp)(Game)
