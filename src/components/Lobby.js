import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';

import { API_ROOT, API_WS_ROOT } from '../constants/api-endpoints';

import ActionCable from 'actioncable'

class Lobby extends Component {

  //triggers where there is a change to the # of users
  updateUsers = (response) => {
    //update redux and display list of users
    // const cable = ActionCable.createConsumer()
    this.props.setUsers(response.users)
  }

  componentDidMount = () => {
    this.subscription = this.context.cable.subscriptions.create(
      'LobbiesChannel',
      {
          received (data) {
              console.log(data)
          }
      }
    )
  }

  renderUsersList = () => {
    return this.props.users.map(user => {
      return <li className="bg-purple white mafia-font m1 s3">{user.username}</li>
    })
  }

  render() {
    return(
      <div className = 'mxa py1 bg-black abs fill ac'>
        <div className = 'bg-hot-pink black f jcc'>
          <h2 className='mafia-font'>{this.props.lobbyName}</h2>
        </div>
        <div className='lobby-list bg-hot-pink'>
          <ul className='bg-hot-pink m1 p1'>
            {/* subscribe to the specific channel lobbies w special id */}
              {this.renderUsersList()}
            {/* Cable specifies what we are sending, and what we will get back */}
          </ul>
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
    },
    setUsers: (users) => {
      dispatch({type: "SET_USERS", payload: users})
    }
  }
}


export default connect(msp, mdp)(Lobby)
