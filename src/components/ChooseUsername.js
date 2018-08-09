import { connect } from 'react-redux';
import React, { Component, Fragment } from 'react';

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
    if(this.state.usernameValue != "") {
      return <input type="submit" value="CREATE LOBBY" className='bg-hot-pink mafia-font white br10' onClick={this.handleSubmit}/>
    }
  }

  handleSubmit = () => {
    this.props.addUsername(this.state.usernameValue)
    this.setState({
      startLobby: true
    })
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

            <div className='f x y jcc aic'>
              <div className='name-box fa bg-black'>
                {this.state.clickedQuestion ?
                  <input type="text" value={this.state.usernameValue} onChange={this.handleUsernameChange} className='bg-white blood-red mafia-font' />
                  :
                  <div className='big-question' onClick={this.handleQuestionClick}>?</div>
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
    lobbyExists: state.lobbyExists
  }
}

function mdp(dispatch) {
  return {
    addUsername: (username) => {
      dispatch({type: "ADD_USERNAME", payload: username})
    }
  }
}

export default connect(msp, mdp)(ChooseUsername)
