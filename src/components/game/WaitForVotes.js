import React from "react";
import Emoji from "../Emoji"
const WaitForVotes = props => {
  return (
    <div className = 'bg-black abs f fill jcc aic tac'>
      <h2 className='mafia-font white'>{<Emoji symbol="⏳" label="hourglass"/>}Waiting on other voters...{<Emoji symbol="⏳" label="hourglass"/>}</h2>
    </div>
  )
}

export default WaitForVotes;
