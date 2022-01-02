import React from 'react';
import debounce from 'lodash.debounce';

import { PLAYER1, PLAYER2, PLAYER_JOINED } from 'components/pages/DemoOnePage/contants/rulesStates';
import {
  PLAYER_JOIN_GAME_EVENT,
  PLAYER_LEAVE_GAME_EVENT,
} from 'components/pages/DemoOnePage/contants/channelEvents';

import PlayersStatus from './PlayersStatus';

type Props = {
  game: any;
  gameRoomChannel: any;
  userName: string;
};

/**
 * Waiting state component displays the waiting state of the players.
 */
function WaitingState(props: Props) {
  const { game, gameRoomChannel, userName } = props;

  const { player1, player2, rules, game_name: gameName } = game;

  let message = 'Waiting for two more players';
  if (rules.player1 == PLAYER_JOINED || rules.player2 == PLAYER_JOINED) {
    message = 'Waiting for one more player';
  }

  const isInGame = player1.name == userName || player2.name == userName;
  const buttonText = isInGame ? 'Leave' : 'Join';

  function handleButtonClick(event: React.MouseEvent): void {
    event.preventDefault();

    if (isInGame && gameRoomChannel) {
      const player = player1.name == userName ? PLAYER1 : PLAYER2;
      gameRoomChannel.push(PLAYER_LEAVE_GAME_EVENT, player).receive('error', () => {
        alert('Failed to leave game.');
      });
    }

    if (!isInGame && gameRoomChannel) {
      const player = rules.player1 == 'not_joined' ? PLAYER1 : PLAYER2;
      gameRoomChannel.push(PLAYER_JOIN_GAME_EVENT, player).receive('error', () => {
        alert('Failed to join game.');
      });
    }

    if (!gameRoomChannel) {
      alert('Not connected to game lobby channel.');
    }
  }

  return (
    <div className="flex flex-col text-center">
      <h1 className="text-4xl">{gameName}</h1>
      <p>{message}</p>
      <PlayersStatus game={game} userName={userName} />
      <button
        className="mt-8 border border-green-gecko rounded"
        onClick={debounce(handleButtonClick, 200)}
      >
        {buttonText}
      </button>
    </div>
  );
}

export default WaitingState;
