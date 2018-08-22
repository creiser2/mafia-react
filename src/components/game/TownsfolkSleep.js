import React, { Component, Fragment } from "react";
import { connect } from 'react-redux';
import Emoji from '../Emoji';

class TownsfolkSleep extends Component {
  render() {
      return (
        <Fragment>
          <div className = 'bg-black abs f fill jcc aic tac'>
            <h2 className='mafia-font white'>{<Emoji symbol="🌙" label="moon"/>}TOWNSFOLK SLEEP{<Emoji symbol="🌙" label="moon"/>}</h2>
          </div>
          <div className='log-div'>
            <marquee behavior="scroll" direction="left" className="log-scroll mafia-font">{this.props.log}</marquee>
          </div>
        </Fragment>
      )
    }
}

function msp(state) {
  return {
    users: state.users,
    user: state.user,
    turn: state.turn,
    lobbyId: state.lobbyId,
    log: state.log
  }
}

function mdp(dispatch) {
  return {
    setTurn: (type) => {
      dispatch({type: "SET_TURN", payload: type})
    },
  }
}


export default connect(msp, mdp)(TownsfolkSleep)
