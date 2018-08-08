import React, { Component } from 'react';
import { connect } from 'react-redux'


class JoinLobby extends Component {
  state = {
    enterLobbyName: false,
    enterLobbyPassword: false,
    nameValue: "",
    passwordValue: ""
  }

  handleLobbyNameClick = () => {
    this.setState({
      enterLobbyName: true,
    })
  }

  handleLobbyPasswordClick = () => {
    this.setState({
      enterLobbyPassword: true,
    })
  }

  handleNameChange = (event) => {
    console.log(this.state.nameValue)
    this.setState({
      nameValue: event.target.value
    })
  }

  handlePasswordChange = (event) => {
    console.log(this.state.passwordValue)
    this.setState({
      passwordValue: event.target.value
    })
  }

  renderSubmitButton = () => {
    if(this.state.enterLobbyPassword && this.state.enterLobbyName) {
      return <input type="submit" value="Submit" className='bg-hot-pink mafia-font white'/>
    }
  }

  render() {
    return(
      <div className = 'gutter mxa py1 border abs fill ac mafia-dude'>
        <div className = 'bg-black hot-pink f jcc'>
          <h2 className='mafia-font'>Join A Lobby</h2>
        </div>
        <div className = "p1 bg-black hot-pink mb2 bottom rel mxa mw-10 br10 top-600">
          {this.state.enterLobbyName ?
            <input type="text" value={this.state.nameValue} onChange={this.handleNameChange} className='bg-black hot-pink mafia-font'/>
            :
            <button className='s4 mafia-font bg-black hot-pink' onClick={this.handleLobbyNameClick}>LOBBY NAME</button>
          }
          {this.state.enterLobbyPassword ?
            <input type="text" value={this.state.passwordValue} onChange={this.handlePasswordChange} className='bg-black hot-pink mafia-font' type='password'/>
            :
            <button className='s4 mafia-font bg-black hot-pink' onClick={this.handleLobbyPasswordClick}>LOBBY PASSWORD</button>
          }
          {this.renderSubmitButton()}
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

}

export default connect(msp, mdp)(JoinLobby)
