import { connect } from 'react-redux';
import React, { Component, Fragment } from 'react';

import { USER_ROOT, HEADERS, API_WS_ROOT } from '../constants/api-endpoints'
import Lobby from './Lobby'
import { ActionCableProvider } from 'react-actioncable-provider';
// import { ActionCable } from 'actioncable'

class ChooseUsername extends Component {

  state = {
    //To see if input is ready to render
    clickedQuestion: false,
    usernameValue: "",
    startLobby: false
  }

  handleQuestionClick = () => {
    this.setState({
      clickedQuestion: true,
    })
  }

  handleUsernameChange = (event) => {
    this.setState({
      usernameValue: event.target.value
    })
  }

  renderSubmitButton = () => {
    if(this.state.usernameValue !== "") {
      return <input type="submit" value={this.props.hostOrJoin} className='bg-hot-pink mafia-font white br10' onClick={this.handleSubmit}/>
    }
  }

  //on submit, add username to redux, then persist in backend and
  handleSubmit = () => {
    this.props.addUsername(this.state.usernameValue)

    //persist user in backend
    fetch(USER_ROOT, {
      method: 'POST',
      headers: HEADERS,
      body: JSON.stringify({
        username: this.state.usernameValue,
        lobby_id: this.props.lobbyId
      })
    }).then(response => response.json())
    .then(json => this.props.setUser(json))
    .then(response => this.setState({
      startLobby: true
    }))
  }

  render() {
    return(
      <Fragment>
        {this.state.startLobby ?
            <ActionCableProvider url={API_WS_ROOT}>
              <Lobby />
            </ActionCableProvider>
          :
          <div className = 'gutter mxa py1 blood-border abs fill ac'>
            <div className = 'bg-black blood-red f jcc'>
              <h2 className=''>WHAT'S YOUR NAME?</h2>
            </div>
            <p className='mafia-font'>Lobby Name: {this.props.lobbyName}</p>
            <p className='mafia-font'>Lobby Password: {this.props.lobbyPassword}</p>

            <div className='f x y jcc aic'>
              <div className='name-box fa bg-black'>
                {this.state.clickedQuestion ?
                  <input type="text" value={this.state.usernameValue} onChange={this.handleUsernameChange} className='bg-white blood-red mafia-font' />
                  :
                  <div className='big-question mafia-font' onClick={this.handleQuestionClick}>?</div>
                }
                {this.renderSubmitButton()}
              </div>
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
    lobbyExists: state.lobbyExists,
    lobbyName: state.lobbyName,
    lobbyPassword: state.lobbyPassword,
    username: state.username,
    lobbyId: state.lobbyId,
    user: state.user,
    users: state.users
  }
}

function mdp(dispatch) {
  return {
    addUsername: (username) => {
      dispatch({type: "ADD_USERNAME", payload: username})
    },
    setUser: (user) => {
      dispatch({type: "SET_USER", payload: user})
    },
    addUser: (user) => {
      dispatch({type: "ADD_USER", payload: user})
    }
  }
}

export default connect(msp, mdp)(ChooseUsername)
