import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';

class Dead extends Component {
  render() {
    return (
      <div className = 'mxa py1 bg-black abs fill ac'>
        <div className = 'bg-blood-red black f'>
          <div className="mla">
            <h2 className='mafia-font'>{'\u2620'}YOU ARE DEAD{'\u2620'}</h2>
          </div>
          <h3 className='mafia-font mla'>PLAYER: {this.props.user.username}</h3>
        </div>
        <div className='lobby-list bg-hot-pink'>

        </div>
      </div>
    )
  }
}

function msp(state) {
  return {
    users: state.users,
    user: state.user,
    turn: state.turn,
    lobbyId: state.lobbyId
  }
}

function mdp(dispatch) {
  return {
    setTurn: (type) => {
      dispatch({type: "SET_TURN", payload: type})
    },
  }
}


export default connect(msp, mdp)(Dead)
