import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';

import { ActionCable } from 'react-actioncable-provider';
import { API_ROOT, API_WS_ROOT, HEADERS, START_GAME, GET_LOBBY_USERS } from '../constants/api-endpoints';

import Game from './Game'
// import Cable from './Cable'
import Horc from './horc'

class Lobby extends Component {

  state = {
    startGame: false
  }

  componentDidMount = () => {
    fetch(`${GET_LOBBY_USERS}` + this.props.lobbyId)
    .then(response => response.json())
    .then(json => this.props.setUsers(json.data.lobby.users))
  }

  //triggers where there is a change to the # of users
  updateUsers = (response) => {
    //update redux and display list of users
    // const cable = ActionCable.createConsumer()
    if(response.startGame) {
      this.handleGameStarted()
    } else {
      this.props.setUsers(response.users)
    }
  }

  renderUsersList = () => {
    return this.props.users.map(user => {
      return <li className="bg-purple white mafia-font m1 s3">{user.username}</li>
    })
  }

  renderStartGameButton = () => {
    if(this.props.isHost) {
      return <button className='mafia-button back-button' onClick={this.startGame}>Start Game</button>
    }
  }

  handleGameStarted = () => {
    this.setState({
      startGame: true
    })
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
            <LoadingGame />
          :
          <div className = 'mxa py1 bg-black abs fill ac'>
          <div className = 'bg-hot-pink black f jcc'>
            <h2 className='mafia-font'>{this.props.lobbyName}</h2>
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
