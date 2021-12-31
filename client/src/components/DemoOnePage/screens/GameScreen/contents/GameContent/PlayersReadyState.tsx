import React, { useContext } from 'react';
import debounce from 'lodash.debounce';
import classNames from 'classnames';

import { useAppSelector } from 'components/DemoOnePage/app/hooks';
import { selectUserName } from 'components/DemoOnePage/app/features/game/gameSlice';
import {
  PLAYER_LEAVE_GAME_EVENT,
  PLAYER_IS_READY_EVENT,
} from 'components/DemoOnePage/contants/channelEvents';
import { SocketContext } from 'components/DemoOnePage/providers/SocketProvider';
import { findChannelTopic, getGameRoomChannel } from 'components/DemoOnePage/contants/channels';

import PlayersStatus from './PlayersStatus';

type Props = {
  game: any;
};

/**
 * Players ready state component displays the ready state of the players.
 */
function PlayersReadyState(props: Props) {
  const { game } = props;

  const userName = useAppSelector(selectUserName);
  const socket = useContext(SocketContext);

  const { player1, player2, rules, game_name: gameName } = game;

  const isInGame = player1.name == userName || player2.name == userName;
  const youAreReady =
    (rules.player1 == 'ready' && player1.name == userName) ||
    (rules.player2 == 'ready' && player2.name == userName);
  const aPlayerIsReady = rules.player1 == 'ready' || rules.player2 == 'ready';
  const readyButtonClass = classNames('mt-8 border border-green-gecko rounded', {
    invisible: !isInGame || youAreReady,
  });
  const leaveButtonClass = classNames('mt-4 border border-green-gecko rounded', {
    invisible: !isInGame,
  });

  const channels = socket == null ? [] : socket.channels;
  const gameRoomChannelTopic = getGameRoomChannel(gameName);
  const gameRoomChannel = findChannelTopic(channels, gameRoomChannelTopic);
  const player = player1.name == userName ? 'player1' : 'player2';

  function handleReadyButtonClick(event: React.MouseEvent): void {
    event.preventDefault();

    if (gameRoomChannel) {
      gameRoomChannel.push(PLAYER_IS_READY_EVENT, player).receive('error', () => {
        alert('Failed to be ready for game.');
      });
    } else {
      alert('Not connected to game lobby channel.');
    }
  }

  function handleLeaveButtonClick(event: React.MouseEvent): void {
    event.preventDefault();

    if (gameRoomChannel) {
      gameRoomChannel.push(PLAYER_LEAVE_GAME_EVENT, player).receive('error', () => {
        alert('Failed to leave game.');
      });
    } else {
      alert('Not connected to game lobby channel.');
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
