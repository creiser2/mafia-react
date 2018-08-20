import React, { Component, Fragment } from 'react';

class SpecialForm extends Component {
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
    let lowerCasedName = event.target.value.toLowerCase()
    this.setState({
      nameValue: lowerCasedName
    })
    console.log(this.state.nameValue)
  }

  handlePasswordChange = (event) => {
    let lowerCasedPassword = event.target.value.toLowerCase()
    this.setState({
      passwordValue: lowerCasedPassword
    })
    console.log(this.state.passwordValue)
  }

  renderSubmitButton = () => {
    if(this.state.enterLobbyPassword && this.state.enterLobbyName) {
      return <input type="submit" value={this.props.hostOrJoin} className='bg-hot-pink mafia-font white br10' onClick={(event) => this.props.handleSubmit(event, this.state.nameValue, this.state.passwordValue)}/>
    }
  }

  render() {
    return(
      <Fragment>
      {this.state.enterLobbyName ?
          <input type="text" value={this.state.nameValue} onChange={this.handleNameChange} className='bg-black hot-pink-button mafia-font'/>
          :
          <button className='s4 mafia-font bg-black hot-pink-button' onClick={this.handleLobbyNameClick}>LOBBY NAME</button>
        }
        {this.state.enterLobbyPassword ?
          <input type="text" value={this.state.passwordValue} onChange={this.handlePasswordChange} className='bg-black hot-pink-button mafia-font'/>
          :
          <button className='s4 mafia-font bg-black hot-pink-button' onClick={this.handleLobbyPasswordClick}>LOBBY PASSWORD</button>
        }
      {this.renderSubmitButton()}
      </Fragment>
    )
  }
}


export default SpecialForm
