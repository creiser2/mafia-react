import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import Emoji from '../Emoji'

class MafiaKill extends Component {

  state = {
    hoveredOn: ''
  }

  renderKillList = () => {
    //filter out yourself, and dead victims
    let victims = this.props.alivePlayers.filter(user => user.id !== this.props.user.id)

    return victims.map(user => {
      if(user.username === this.state.hoveredOn) {
        return <li className="bg-purple-murder white mafia-font m1 s3 br10" onClick={this.props.killVictim} onMouseEnter={this.killHoverOn} onMouseLeave={this.killHoverOff} id={user.username}>{<Emoji symbol="⚔️" label="cross_swords" id={user.username}/>}{user.username}{<Emoji symbol="⚔️" label="cross_swords" id={user.username}/>}</li>
      } else {
        return <li className="bg-purple-murder white mafia-font m1 s3 br10" onClick={this.props.killVictim} onMouseEnter={this.killHoverOn} onMouseLeave={this.killHoverOff} id={user.username}>{user.username}</li>
      }
    })
  }

  //render emojis on hover over for mafia
  killHoverOn = (event) => {
    // let username = event.target.username
    this.setState({
      hoveredOn: event.target.innerText
    })
  }

  killHoverOff = () => {
    this.setState({
      hoveredOn: ''
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
