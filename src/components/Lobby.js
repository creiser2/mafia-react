import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';

import { ActionCable } from 'react-actioncable-provider';
import { API_ROOT } from '../constants/api-endpoints';
import Cable from './Cable'

class Lobby extends Component {

  updateUsers = (response) => {
    debugger;
  }


  render() {
    console.log(this.props.lobbyId)
    return(
      <div className = 'gutter mxa py1 blood-border abs fill ac'>
        <div className = 'bg-black blood-red f jcc'>
          <h2 className='mafia-font'>{this.props.lobbyName}</h2>
        </div>
        <div className='lobby-list'>
          {/* subscribe to the specific channel lobbies w special id */}
          <ActionCable
           channel={{ channel: 'LobbiesChannel', lobby_id: this.props.lobbyId }}
          />
          {/* Cable specifies what we are sending, and what we will get back */}
          <Cable
            users={this.props.users}
            handleReceivedUsers={this.updateUsers}
            lobbyId={this.props.lobbyId}
          />
        </div>
      </div>
    )
  }
}

function msp(state) {
  return {
    lobbyExists: state.lobbyExists,
    lobbyName: state.lobbyName,
    lobbyPassword: state.lobbyPassword,
    lobbyId: state.lobbyId,
    username: state.username,
    users: state.users,
    user: state.user,
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
    }
  }
}


export default connect(msp, mdp)(Lobby)
