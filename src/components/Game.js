import React, { Component, Fragment } from 'react';
import { ActionCable } from 'react-actioncable-provider';
import { connect } from 'react-redux';
import { API_WS_ROOT, HEADERS, UPDATE_USER_STATUS, PICK_MAFIA, UPDATE_LOBBY_PROTECTION } from '../constants/api-endpoints'

import MafiaKill from './game/MafiaKill'
import TownsfolkSleep from './game/TownsfolkSleep'

class Game extends Component {
  state = {
    openGame: false,
    log: "",
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

  //rendered when it is the MAFIA's turn
  renderMafiaTurn = () => {
    //if you are the mafia, render mafia selection
    if(this.props.user.role === 'mafia') {
      return <MafiaKill />
    //else, render sleep turn for townsfolk
    } else {
      return <TownsfolkSleep />
    }
  }

  renderTownsfolkTurn = () => {
    console.log("TOWNSFOLK TURN")
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
        //unprotect lobby to handle disconnections
        fetch(`${UPDATE_LOBBY_PROTECTION}` + this.props.lobbyId, {
          method: 'PUT',
          headers: HEADERS,
          body: JSON.stringify({
            id: this.props.lobbyId,
            protected: false
          })
        })
        break;
      //user disconnects, handle this on front end
      case "DC_USER":
        this.props.setUsers(response.updated_users)
        if(response.user.role === "mafia") {
          window.close()
        } else {
          this.setState({
            log: `${response.user.username} has disconnected.`
          })
        }
        break;
    }
  }

  render() {
    return(
      <div className = 'mxa py1 bg-black abs fill ac'>
        <div className = 'bg-hot-pink black f jcc'>
          <h2 className='mafia-font'>{this.props.username}</h2>
          <h3 className='mafia-font'>Role: {this.props.user.role}</h3>
          </div>
            <ActionCable
              channel={{channel: 'LobbiesChannel', lobby_id: this.props.lobbyId, user_id: this.props.user.id}}
              onReceived={this.updateGame}
            />
          <div className='lobby-list bg-hot-pink'>
          {this.state.openGame || this.props.user.role === 'mafia' ?
            [
              this.props.turn === 'mafia' ?
                this.renderMafiaTurn()
              :
                this.renderTownsfolkTurn()
            ]
            :
            <div>Selecting Mafia</div>
          }
          <ul className='bg-hot-pink m1 p1'>
          </ul>
          <div>{this.state.log}</div>
        </div>
      </div>
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
    }
  }
}


export default connect(msp, mdp)(Game)
