import React, { Component, Fragment } from 'react';
import { ActionCable } from 'react-actioncable-provider';
import { connect } from 'react-redux';
import { API_WS_ROOT, HEADERS, UPDATE_USER_STATUS } from '../constants/api-endpoints'


class Game extends Component {


  componentDidMount = () => {
    this.getRandomMafia()
  }

  getRandomMafia = () => {
    let randInt = Math.floor(Math.random() * this.props.users.length)
    let mafia = this.props.users[randInt]
    //set redux if you are the mafia you will know
    if(mafia.id === this.props.user.id) {
      let role = "mafia"
      this.props.setRole(role)
    }
    fetch(`${UPDATE_USER_STATUS}` + mafia.id, {
      method: 'PUT',
      headers: HEADERS,
      body: JSON.stringify({
        role: "mafia"
      })
    })
  }

  render() {
    return(
      <div className = 'mxa py1 bg-black abs fill ac'>
        <div className = 'bg-hot-pink black f jcc'>
          <h2 className='mafia-font'>{this.props.username}</h2>
          <h3 className='mafia-font'>Role: {this.props.user.role}</h3>
          </div>
          <div className='lobby-list bg-hot-pink'>
          <ul className='bg-hot-pink m1 p1'>
          </ul>
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
    isHost: state.isHost
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
    }
  }
}


export default connect(msp, mdp)(Game)
