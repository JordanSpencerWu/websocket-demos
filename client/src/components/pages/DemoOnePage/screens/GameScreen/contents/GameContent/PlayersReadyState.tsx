import React from 'react';
import debounce from 'lodash.debounce';
import classNames from 'classnames';

import {
  PLAYER1,
  PLAYER2,
  PLAYER_IS_READY,
} from 'components/pages/DemoOnePage/contants/rulesStates';
import {
  PLAYER_LEAVE_GAME_EVENT,
  PLAYER_IS_READY_EVENT,
} from 'components/pages/DemoOnePage/contants/channelEvents';

import PlayersStatus from './PlayersStatus';

type Props = {
  game: any;
  gameRoomChannel: any;
  userName: string;
};

/**
 * Players ready state component displays the ready state of the players.
 */
function PlayersReadyState(props: Props) {
  const { game, gameRoomChannel, userName } = props;

  const { player1, player2, rules, game_name: gameName } = game;

  const isInGame = player1.name == userName || player2.name == userName;
  const youAreReady =
    (rules.player1 == PLAYER_IS_READY && player1.name == userName) ||
    (rules.player2 == PLAYER_IS_READY && player2.name == userName);
  const aPlayerIsReady = rules.player1 == PLAYER_IS_READY || rules.player2 == PLAYER_IS_READY;
  const readyButtonClass = classNames('mt-8 border border-green-gecko rounded', {
    invisible: !isInGame || youAreReady,
  });
  const leaveButtonClass = classNames('mt-4 border border-green-gecko rounded', {
    invisible: !isInGame,
  });
  const player = player1.name == userName ? PLAYER1 : PLAYER2;

  function handleReadyButtonClick(event: React.MouseEvent): void {
    event.preventDefault();

    if (gameRoomChannel) {
      gameRoomChannel.push(PLAYER_IS_READY_EVENT, player).receive('error', () => {
        alert('Failed to be ready for game.');
      });
    } else {
      alert('Not connected to game room channel.');
    }
  }

  function handleLeaveButtonClick(event: React.MouseEvent): void {
    event.preventDefault();

    if (gameRoomChannel) {
      gameRoomChannel.push(PLAYER_LEAVE_GAME_EVENT, player).receive('error', () => {
        alert('Failed to leave game.');
      });
    } else {
      alert('Not connected to game room channel.');
    }
  }

  let message = 'Waiting for both players to be ready';
  if (aPlayerIsReady) {
    message = 'Waiting for you to be ready';
  }
  if (youAreReady) {
    message = 'Waiting for other player to be ready';
  }

  return (
    <div className="flex flex-col text-center">
      <h1 className="text-4xl">{gameName}</h1>
      <p>{message}</p>
      <PlayersStatus game={game} userName={userName} />
      <button className={readyButtonClass} onClick={debounce(handleReadyButtonClick, 200)}>
        Ready
      </button>
      <button className={leaveButtonClass} onClick={debounce(handleLeaveButtonClick, 200)}>
        Leave
      </button>
    </div>
  );
}

export default PlayersReadyState;
