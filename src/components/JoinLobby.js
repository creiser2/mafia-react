import React, { Component } from 'react';
import SpecialForm from './SpecialForm';
import { connect } from 'react-redux';

import { API_AVAIL, HEADERS } from '../constants/api-endpoints'

class JoinLobby extends Component {

  //join the lobby
  handleNamePasswordSubmit = (event, lobbyName, lobbyPassword) => {
    fetch(API_AVAIL, {
      method: 'POST',
      headers: HEADERS,
      body: JSON.stringify({
        name: lobbyName
      })
    }).then(response => response.json())
    .then(json => this.handleJoinLobby(json, lobbyName, lobbyPassword))
  }

  //if the lobby is not available, that means that the user is trying to join a lobby that exists
  handleJoinLobby = (json, lobbyName, lobbyPassword) => {
    //try password on lobby (make custon backend route)
    if(!json.availability) {
      
    }
  }

  render() {
    return(
      <div className = 'gutter mxa py1 border abs fill ac mafia-dude'>
        <div className = 'bg-black hot-pink pl20 pr100'>
          <button className='mafia-button back-button' onClick={this.props.goBack}>Back</button>
          <h2 className='mafia-font'>Join A Lobby</h2>
        </div>
        <div className = "p1 bg-black hot-pink mb2 bottom rel mxa mw-10 br10 top-600">
          <SpecialForm handleSubmit={this.handleNamePasswordSubmit} hostOrJoin="JOIN"/>
        </div>
      </div>
    )
  }
}

function msp(state) {
  return {
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
    }
  }
}

export default connect(msp, mdp)(JoinLobby)
