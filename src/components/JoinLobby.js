import React, { Component } from 'react';
import SpecialForm from './SpecialForm';
import { connect } from 'react-redux';


class JoinLobby extends Component {

  //join the lobby
  handleNamePasswordSubmit = (event, lobbyName, lobbyPassword) => {
    debugger;
  }

  render() {
    return(
      <div className = 'gutter mxa py1 border abs fill ac mafia-dude'>
        <div className = 'bg-black hot-pink pl20 pr100'>
          <button className='mafia-button back-button' onClick={this.props.goBack}>Back</button>
          <h2 className='mafia-font'>Join A Lobby</h2>
        </div>
        <div className = "p1 bg-black hot-pink mb2 bottom rel mxa mw-10 br10 top-600">
          <SpecialForm handleSubmit={this.handleNamePasswordSubmit} hostOrJoin="JOIN"/>
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
  return {
    
  }
}

export default connect(msp, mdp)(JoinLobby)
