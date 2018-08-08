import React from 'react';


const HostLobby = (props) => {
  return(
    <div className = 'gutter mxa py1 border abs fill ac'>
      <div className = 'bg-black hot-pink f jcc'>
        <h2 className='mafia-font'>Host A Lobby</h2>
      </div>
      <div className = "p1 bg-black hot-pink mb2 bottom rel mxa mw-10 br10 top-600">
        <button className='s4 mafia-font bg-black hot-pink'>LOBBY NAME</button>
        <button className='s4 mafia-font bg-black hot-pink'>LOBBY PASSWORD</button>
      </div>
    </div>
  )
}

export default HostLobby
