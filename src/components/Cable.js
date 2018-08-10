import React, { Fragment } from 'react';
import { ActionCable } from 'react-actioncable-provider';

const Cable = (props) => {
  return (
    <Fragment>
      {props.users.map(user => {
        return (
          <ActionCable
            channel={{ channel: 'LobbiesChannel', lobby_id: props.lobbyId }}
            onReceived={props.handleReceivedUsers}
          />
        );
      })}
    </Fragment>
  );
};

export default Cable;
