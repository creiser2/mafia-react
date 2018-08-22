import React from "react";

const MafiaWin = props => {
  return (
    <div className = 'gutter mxa py1 border-red abs fill ac mafia-dude-2'>
      <div className = 'bg-black blood-red f jcc'>
        <h2 className='mafia-font'>The Mafioso Has Won</h2>
      </div>
      <div className = "p1 bg-black blood-red mb2 bottom rel mxa mw-10 br10 top-600">
        <h2>Player: {props.player}</h2>
      </div>
    </div>
  )
}

export default MafiaWin;
