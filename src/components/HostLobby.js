import React, { Component, Fragment } from 'react';
import SpecialForm from './SpecialForm';
import { connect } from 'react-redux';
import { addLobbyName } from '../actions/actions'
import { API_AVAIL, API_ROOT, HEADERS } from '../constants/api-endpoints'

import ChooseUsername from './ChooseUsername'


class HostLobby extends Component {

  handleNamePasswordSubmit = (event, lobbyName, lobbyPassword) => {
    fetch(API_AVAIL, {
      method: 'POST',
      headers: HEADERS,
      body: JSON.stringify({
        name: lobbyName
      })
    }).then(response => response.json()).then(json => this.handleLobbyCreation(json, lobbyName, lobbyPassword))
  }

  handleLobbyCreation = (json, lobbyName, lobbyPassword) => {

    //if lobby name available, set redux state and begin websocket
    if(json.availability) {
      this.props.addLobbyName(lobbyName)
      this.props.addLobbyPassword(lobbyPassword)
      this.props.openLobby()
      this.createLobby(lobbyName, lobbyPassword)
    } else {
      //handle error where lobby name is taken

    }
  }

  //persist lobby in backend, and update redux state
  createLobby = (lobbyName, lobbyPassword) => {
    fetch(API_ROOT, {
      method: 'POST',
      headers: HEADERS,
      body: JSON.stringify({
        name: lobbyName,
        password: lobbyPassword,
        protected: false
      })
    })
    .then(response => response.json())
    .then(json => this.props.addLobbyId(json.lobby.id))
    .then(this.props.setHost())
  }


  render() {
    return(
      <Fragment>
        {this.props.lobbyExists ?
          <ChooseUsername hostOrJoin="CREATE"/>
          :
          <div className = 'gutter mxa py1 border abs fill ac mafia-dude'>
            <div className = 'bg-black hot-pink pl20 pr100'>
              <button className='mafia-button back-button' onClick={this.props.goBack}>Back</button>
              <h2 className='mafia-font'>Host A Lobby</h2>
            </div>
            <div className = "p1 bg-black hot-pink mb2 bottom rel mxa mw-10 br10 top-600">
              <SpecialForm handleSubmit={this.handleNamePasswordSubmit} hostOrJoin="HOST"/>
            </div>
          </div>
        }
      </Fragment>
    )
  }
}

//Only need lobbyExists for this for conditional rendering
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
    },
    addLobbyId: (id) => {
      dispatch({type: "ADD_LOBBY_ID", payload: id})
    },
    setHost: () => {
      dispatch({type: "SET_HOST"})
    }
  }
}

export default connect(msp, mdp)(HostLobby)
