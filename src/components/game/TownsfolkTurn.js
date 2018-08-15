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

  renderVoteOptions = () => {
    //filter out yourself, and dead victims
    let victims = this.props.users.filter(user => user.id !== this.props.user.id && user.alive)

    return victims.map(user => {
      if(user.username === this.state.voteUsername) {
        return <li className="bg-black yellow mafia-font m1 s3" onClick={this.handleVote}>{user.username}</li>
      } else {
        return <li className="bg-black white mafia-font m1 s3" onClick={this.handleVote}>{user.username}</li>
      }
    })
  }

  render() {
    return (
      <div className = 'mxa py1 bg-black abs fill ac'>
        <div className = 'bg-hot-pink black f'>
          <div className="mla">
            <h2 className='mafia-font'>WHO IS THE MAFIA?</h2>
          </div>
          <h3 className='mafia-font mla'>PLAYER: {this.props.user.username}</h3>
        </div>
        <div className='lobby-list bg-hot-pink'>
          <ul className='bg-hot-pink m1 p1'>
            {this.renderVoteOptions()}
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
