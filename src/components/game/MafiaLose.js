import React from "react";
import Emoji from '../Emoji';

const MafiaLose = props => {
  return (
    <div className = 'bg-black abs f fill jcc aic tac'>
      <h2 className='mafia-font blood-red'>{<Emoji symbol="🏳️" label="white-flag"/>} The Townsfolk Have Killed You! {<Emoji symbol="🏳️" label="white-flag"/>}</h2>
    </div>
  )
}

export default MafiaLose;
