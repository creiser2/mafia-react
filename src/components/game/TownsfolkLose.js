import React from "react";
import Emoji from '../Emoji';

const TownsfolkLose = props => {
  return (
    <div className = 'bg-black abs f fill jcc aic tac'>
      <h2 className='mafia-font white'>{<Emoji symbol="😱" label="scared-face"/>} The mafioso has killed all of the townsfolk! {<Emoji symbol="😱" label="scared-face"/>}</h2>
    </div>
  )
}

export default TownsfolkLose;
