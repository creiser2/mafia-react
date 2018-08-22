import React from "react";
import Emoji from '../Emoji';

const SelectingMafia = props => {
  return (
    <div className = 'bg-black abs f fill jcc aic'>
      <h2 className='mafia-font white'>{<Emoji symbol="🕵️‍" label="detective"/>} Selecting the Mafia... {<Emoji symbol="🤔" label="thinking"/>}</h2>
    </div>
  )
}

export default SelectingMafia;
