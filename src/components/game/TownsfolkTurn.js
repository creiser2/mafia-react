import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';


class MafiaKill extends Component {

  state = {
    voteUsername: ""
  }

  handleVote = (event) => {
    this.setState({
      voteUsername: event.target.innerText
    })
  }

  renderKillList = () => {
    //filter out yourself, and dead victims
    let victims = this.props.users.filter(user => user.id !== this.props.user.id && user.alive)

    return victims.map(user => {
      return <li className="bg-black white mafia-font m1 s3" onClick={this.handleVote}>{user.username}</li>
    })
  }

  render() {
    return (
      <div className='lobby-list bg-hot-pink'>
        <ul className='bg-hot-pink m1 p1'>
          {this.renderKillList()}
        </ul>
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
