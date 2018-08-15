import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';


class MafiaKill extends Component {

  renderKillList = () => {
    //filter out yourself, and dead victims
    let victims = this.props.users.filter(user => user.id !== this.props.user.id && user.role !== 'dead')


    return victims.map(user => {
      return <li className="bg-purple white mafia-font m1 s3" onClick={this.props.killVictim}>{user.username}</li>
    })
  }

  render() {
    return (
      <div className = 'mxa py1 bg-black abs fill ac'>
        <div className = 'bg-hot-pink black f jcc'>
          <h3 className='mafia-font'>MAFIA - ASSASSINATE SOMEONE</h3>
        </div>
        <div className='lobby-list bg-hot-pink'>
          <ul className='bg-hot-pink m1 p1'>
            {this.renderKillList()}
          </ul>
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


export default connect(msp, mdp)(MafiaKill)
