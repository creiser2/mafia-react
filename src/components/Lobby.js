import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';

import { ActionCable } from 'react-actioncable-provider';
import { API_ROOT, API_WS_ROOT, HEADERS, START_GAME, GET_LOBBY_USERS, UPDATE_LOBBY_PROTECTION } from '../constants/api-endpoints';

import Game from './Game'
// import Cable from './Cable'
import Horc from './Horc'

class Lobby extends Component {

  state = {
    startGame: false
  }

  componentDidMount = () => {
    fetch(`${GET_LOBBY_USERS}` + this.props.lobbyId)
    .then(response => response.json())
    .then(json => this.props.setUsers(json.data.lobby.users))
  }

  //protect the lobby when switching over from lobby cable to game cable
  updateLobbyProtection = () => {
    fetch(`${UPDATE_LOBBY_PROTECTION}` + this.props.lobbyId, {
      method: 'PUT',
      headers: HEADERS,
      body: JSON.stringify({
        id: this.props.lobbyId,
        protected: true
      })
    }).then(response => response.json())
    .then(json => this.setState({
      startGame: true
    }))
  }

  //triggers where there is a change to the # of users
  updateUsers = (response) => {
    const { type } = response
    //update redux and display list of users
    // const cable = ActionCable.createConsumer()
    switch(type) {
      case "CONNECT_USER":
        this.props.setUsers(response.users)
        break;
      case "DC_USER":
        this.props.setUsers(response.updated_users)
        break;
      case "START_GAME":
        this.handleGameStarted()
        break;
    }
  }

  renderUsersList = () => {
    return this.props.users.map(user => {
      return <li className="bg-purple white mafia-font m1 s3 br10">{user.username}</li>
    })
  }

  renderStartGameButton = () => {
    if(this.props.isHost) {
      return <button className='mafia-button back-button' onClick={this.startGame}>Start Game</button>
    }
  }

  handleGameStarted = () => {
    //protect the lobby so when switching cables, it doesn't think everyone disconnected
    this.updateLobbyProtection()
  };


  //Start the game when host decides
  startGame = () => {
    fetch(START_GAME, {
      method: 'POST',
      headers: HEADERS,
      body: JSON.stringify({
        id: this.props.lobbyId
      })
    })
  }

  render() {
    const LoadingGame = Horc(Game);

    return(
        <Fragment>
          {this.state.startGame ?
            <LoadingGame username={this.props.username}/>
          :
          <div className = 'mxa py1 bg-black abs fill ac'>
          <div className = 'bg-hot-pink black f jcc'>
            <h2 className='user-font'>{this.props.lobbyName}</h2>
            </div>
            <div className='lobby-list bg-hot-pink'>
            <ul className='bg-hot-pink m1 p1'>
              <ActionCable
                channel={{channel: 'LobbiesChannel', lobby_id: this.props.lobbyId, user_id: this.props.user.id}}
                onReceived={this.updateUsers}
              />
            {this.renderUsersList()}
            {this.renderStartGameButton()}
            </ul>
          </div>
          </div>
        }
      </Fragment>
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
    }
  }
}


export default connect(msp, mdp)(Lobby)
