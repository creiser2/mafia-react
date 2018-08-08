import React from 'react';


const Homepage = (props) => {
  console.log(props)
  return(
    <div className = 'gutter mxa py1 border abs fill ac knife'>
      <div className = 'bg-black hot-pink f jcc'>
        <h2 className='mafia-font'>MAFIA</h2>
      </div>
      <div className = "p1 bg-black hot-pink mb2 bottom rel mxa mw-10 br10 top-600">
        <button className='s4 mafia-font bg-black hot-pink' onClick={props.joinLobbyClick}>JOIN LOBBY</button>
        <button className='s4 mafia-font bg-black hot-pink' onClick={props.hostLobbyClick}>HOST LOBBY</button>
      </div>
    </div>
  )
}

export default Homepage
