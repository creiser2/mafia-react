import React, { Component, Fragment } from 'react';
import SpecialForm from './SpecialForm';
import { connect } from 'react-redux';

import { API_AVAIL, HEADERS, JOIN_LOBBY } from '../constants/api-endpoints'

import ChooseUsername from './ChooseUsername'

class JoinLobby extends Component {
  state = {
    errorLog: "",
    errorChanged: false
  }

  //check to see if the lobby name exists
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
      fetch(JOIN_LOBBY, {
        method: 'POST',
        headers: HEADERS,
        body: JSON.stringify({
          name: lobbyName,
          password: lobbyPassword
        })
      })
      .then(response => response.json())
      .then(json => this.updateLobbyRedux(json, lobbyName, lobbyPassword))
    } else {
      //lobby name does not exist!
      this.setState({
        errorLog: "Lobby Does Not Exist",
        errorChanged: true
      })
      //flash message disappears after 2 seconds
      this.messageFlash()
    }
  }

  updateLobbyRedux = (response, lobbyName, lobbyPassword) => {
    //the user has correct rights to join the lobby, update redux
    if(response.password_correct) {
      this.props.addLobbyName(lobbyName)
      this.props.addLobbyPassword(lobbyPassword)
      this.props.addLobbyId(response.lobby.id)
      this.props.openLobby()
    } else {
      //Password Wrong!
      this.setState({
        errorLog: "Incorrect Password",
        errorChanged: true
      })
      this.messageFlash()
    }
  }

  messageFlash = () => {
    setTimeout(() => {
      this.setState({
        errorChanged: false
      })
    }, 2000)
  }

  //quick flash render for message
  renderErrorMessage = () => {
    if(this.state.errorChanged) {
      return (
        <div className="bg-blood-red white mt40 b br20 mr10 ml10">{this.state.errorLog}</div>
      )
    } else {
      return null
    }
  }

  render() {
    return(
      <Fragment>
        {this.props.lobbyExists ?
          <ChooseUsername hostOrJoin="JOIN"/>
          :
          <div className = 'gutter mxa py1 border abs fill ac mafia-dude'>
            <div className = 'bg-black hot-pink pl20 pr100'>
              <button className='mafia-button back-button' onClick={this.props.goBack}>Back</button>
              <h2 className='mafia-font'>Join A Lobby</h2>
            </div>
            <div className = "p1 bg-black hot-pink mb2 bottom rel mxa mw-10 br10 top-600">
              <SpecialForm handleSubmit={this.handleNamePasswordSubmit} hostOrJoin="JOIN"/>
            </div>
            {this.renderErrorMessage()}
          </div>
        }
      </Fragment>
    )
  }
}

function msp(state) {
  return {
    user: state.user,
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
    addLobbyId: (id) => {
      dispatch({type: "ADD_LOBBY_ID", payload: id})
    },
    openLobby: () => {
      dispatch({type: "OPEN_LOBBY"})
    }
  }
}

export default connect(msp, mdp)(JoinLobby)
