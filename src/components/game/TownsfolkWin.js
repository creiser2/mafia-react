import React from "react";
import Emoji from '../Emoji';

const WaitForVotes = props => {
  return (
    <div className = 'bg-black abs f fill jcc aic tac'>
      <h2 className='mafia-font white'>{<Emoji symbol="🏁" label="finish-flag"/>}Townsfolk Have Successfully Killed the Mafioso{<Emoji symbol="🏁" label="finish-flag"/>}</h2>
    </div>
  )
}

export default WaitForVotes;
