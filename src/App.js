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
    //Decide which page to render, homepage, join lobby page, or host lobby page
    if (this.state.joinLobby) {
      return <JoinLobby goBack={this.handleGoBack} />
    }
    else if (this.state.hostLobby) {
      return <HostLobby goBack={this.handleGoBack} />
    }
    else {
      return <Homepage joinLobbyClick={this.handleJoinLobbyClick} hostLobbyClick={this.handleHostLobbyClick}/>
    }
  }

  //render join lobby page
  handleJoinLobbyClick = () => {
    this.setState({
      joinLobby: true
    })
  }

  //render host lobby page
  handleHostLobbyClick = () => {
    this.setState({
      hostLobby: true
    })
  }

  //go back to the homepage from either the host lobby or join lobby page
  handleGoBack = () => {
    this.setState({
      hostLobby: false,
      joinLobby: false
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
  return {
    
  }
}

export default connect(msp, mdp)(App);
