import { connect } from 'react-redux';
import React, { Component, Fragment } from 'react';

class ChooseUsername extends Component {
  render() {
    return(
      <div className = 'gutter mxa py1 blood-border abs fill ac'>
        <div className = 'bg-black blood-red f jcc'>
          <h2 className='mafia-font'>WHAT'S YOUR NAME?</h2>
        </div>

        <div className='f x y jcc aic'>
          <div className='name-box fa bg-black'>
            <div className='big-question'>?</div>
          </div>
        </div>
      </div>
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
    addLobbyName: (name) => {
      dispatch({type: "ADD_LOBBY_NAME", payload: name})
    },
    addLobbyPassword: (password) => {
      dispatch({type: "ADD_LOBBY_PASSWORD", payload: password})
    },
    openLobby: () => {
      dispatch({type: "OPEN_LOBBY"})
    }
  }
}

export default connect(msp, mdp)(ChooseUsername)
