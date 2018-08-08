import React, { Component } from 'react';
import logo from './logo.svg';
import './assets/main.css';
import { connect } from 'react-redux'

//components
import Homepage from './components/Homepage'
import JoinLobby from './components/JoinLobby'
import HostLobby from './components/HostLobby'



class App extends Component {

  state = {
    joinLobby: false,
    hostLobby: false
  }

  renderPage = () => {
    if (this.state.joinLobby) {
      return <JoinLobby />
    }
    else if (this.state.hostLobby) {
      return <HostLobby />
    }
    else {
      return <Homepage joinLobbyClick={this.handleJoinLobbyClick} hostLobbyClick={this.handleHostLobbyClick}/>
    }
  }

  handleJoinLobbyClick = () => {
    this.setState({
      joinLobby: true
    })
  }

  handleHostLobbyClick = () => {
    this.setState({
      hostLobby: true
    })
  }

  render() {
    return (
      <div className="App">
        {this.renderPage()}
      </div>
    );
  }
}

function msp(state) {
  return {
    user: state.user,
  }
}

function mdp(dispatch) {

}

export default connect(msp, mdp)(App);
