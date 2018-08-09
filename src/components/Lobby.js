import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';

class Lobby extends Component {
  render() {
    return(
      <div className = 'gutter mxa py1 border abs fill ac'>

      </div>
    )
  }
}

function msp(state) {
  return {
    lobbyExists: state.lobbyExists
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
