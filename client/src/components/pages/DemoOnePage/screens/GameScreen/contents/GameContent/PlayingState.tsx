import React from 'react';
import debounce from 'lodash.debounce';
import classNames from 'classnames';

import { PLAYER1, PLAYER2, PLAYER1_TURN } from 'components/pages/DemoOnePage/contants/rulesStates';
import { PLAYER_LEAVE_GAME_EVENT } from 'components/pages/DemoOnePage/contants/channelEvents';

type Props = {
  game: any;
  gameRoomChannel: any;
  userName: string;
};

function PlayingState(props: Props) {
  const { game, gameRoomChannel, userName } = props;

  const { game_board, game_name: gameName, rules, player1, player2 } = game;
  const isInGame = player1.name == userName || player2.name == userName;
  const youArePlayer1 = player1.name == userName;

  let message = "Other player's turn";
  if (rules.state == PLAYER1_TURN && youArePlayer1) {
    message = 'Your turn';
  }

  const leaveButtonClass = classNames('mt-4 border border-green-gecko rounded', {
    invisible: !isInGame,
  });

  function handleLeaveButtonClick(event: React.MouseEvent): void {
    event.preventDefault();

    if (gameRoomChannel) {
      const player = player1.name == userName ? PLAYER1 : PLAYER2;
      gameRoomChannel.push(PLAYER_LEAVE_GAME_EVENT, player).receive('error', () => {
        alert('Failed to leave game.');
      });
    } else {
      alert('Not connected to game lobby channel.');
    }
  }

  return (
    <div className="flex flex-col text-center">
      <h1 className="text-4xl">{gameName}</h1>
      <p>{message}</p>
      <button className={leaveButtonClass} onClick={debounce(handleLeaveButtonClick, 200)}>
        Leave
      </button>
    </div>
  );
}

export default PlayingState;
