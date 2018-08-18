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

      let userVotes = this.props.votes.find(vote => vote.recipientId === user.id)

      if(userVotes === undefined) {
        userVotes = {count: 0}
      }

      if(user.username === this.state.voteUsername) {
        return (
          <li className="bg-black yellow mafia-font m1 s3" onClick={this.handleVote}>{`${user.username} votes: ${userVotes.count}`}</li>
        )
      } else {
        return (
          <li className="bg-black white mafia-font m1 s3" onClick={this.handleVote}>{user.username}</li>
        )
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
        {this.state.voteUsername !== "" ?
          <button onClick={(event) => this.props.vote(event, this.state.voteUsername)}>CAST VOTE</button>
        :
          null
        }
      </div>
    )
  }
}

function msp(state) {
  return {
    users: state.users,
    user: state.user,
    turn: state.turn,
    lobbyId: state.lobbyId,
    votes: state.votes
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
