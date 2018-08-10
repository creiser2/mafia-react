import { connect } from 'react-redux';
import React, { Component, Fragment } from 'react';

import { USER_ROOT, HEADERS } from '../constants/api-endpoints'
import Lobby from './Lobby'

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
      return <input type="submit" value="CREATE LOBBY" className='bg-hot-pink mafia-font white br10' onClick={this.handleSubmit}/>
    }
  }

  //on submit, add username to redux, then persist in backend and
  handleSubmit = () => {
    this.props.addUsername(this.state.usernameValue)

    console.log("username", this.state.usernameValue)
    console.log("lobbyid", this.props.lobbyId)
    //persist user in backend
    fetch(USER_ROOT, {
      method: 'POST',
      headers: HEADERS,
      body: JSON.stringify({
        username: this.state.usernameValue,
        lobby_id: this.props.lobbyId
      })
    }).then(response => response.json()).then(json => this.setUser(json))

    //for conditional rendering
    this.setState({
      startLobby: true
    })
  }

  //db response triggers redux
  //set user object
  //add yourself to total users array
  setUser = (json) => {
    this.props.setUser(json)
    let updatedUsers = this.props.users
    updatedUsers.push(json)
    this.props.addUser(updatedUsers)
  }

  render() {
    return(
      <Fragment>
        {this.state.startLobby ?
            <Lobby />
          :
          <div className = 'gutter mxa py1 blood-border abs fill ac'>
            <div className = 'bg-black blood-red f jcc'>
              <h2 className='mafia-font'>WHAT'S YOUR NAME?</h2>
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
