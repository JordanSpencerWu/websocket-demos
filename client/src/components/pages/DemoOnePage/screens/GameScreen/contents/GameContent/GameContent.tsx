import React, { useContext, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { useAppSelector, useAppDispatch } from 'components/pages/DemoOnePage/app/hooks';
import { selectGames, updateGame } from 'components/pages/DemoOnePage/app/features/game/gameSlice';
import {
  PLAYER1_TURN,
  PLAYER2_TURN,
  PLAYERS_READY,
  WAITING_FOR_PLAYERS,
} from 'components/pages/DemoOnePage/contants/rulesStates';
import {
  DELETE_GAME_EVENT,
  PLAYER_JOINED_GAME_EVENT,
  PLAYER_LEFT_GAME_EVENT,
  PLAYER_READY_EVENT,
} from 'components/pages/DemoOnePage/contants/channelEvents';
import { SocketContext } from 'components/pages/DemoOnePage/providers/SocketProvider';
import { useJoinChannel, useSocketOnListener } from 'components/pages/DemoOnePage/hooks';
import {
  findChannelTopic,
  GAME_LOBBY_CHANNEL,
  getGameRoomChannel,
} from 'components/pages/DemoOnePage/contants/channels';
import pathTo from 'utils/pathTo';

import WaitingState from './WaitingState';
import PlayersReadyState from './PlayersReadyState';

function renderGameState(game: any) {
  const { rules } = game;

  switch (rules.state) {
    case PLAYER1_TURN:
    case PLAYER2_TURN:
      return <div>TODO: ADD GAME</div>;
    case PLAYERS_READY:
      return <PlayersReadyState game={game} />;
    case WAITING_FOR_PLAYERS:
      return <WaitingState game={game} />;
    default:
      throw new Error('Invalid game rule state.');
  }
}

/**
 * Game content component determines what content to show.
 */
function GameContent() {
  const socket = useContext(SocketContext);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { gameName } = useParams();
  const games = useAppSelector(selectGames);

  const game = games.find((game) => game.game_name == gameName);
  const gameRoomChannelTopic = getGameRoomChannel(gameName);

  useJoinChannel(gameRoomChannelTopic);

  const handleOnPlayerJoined = (payload: object) => {
    dispatch(updateGame(payload));
  };

  useSocketOnListener(gameRoomChannelTopic, PLAYER_JOINED_GAME_EVENT, handleOnPlayerJoined);

  const handleOnPlayerLeft = (payload: object) => {
    dispatch(updateGame(payload));
  };

  useSocketOnListener(gameRoomChannelTopic, PLAYER_LEFT_GAME_EVENT, handleOnPlayerLeft);

  const handleOnPlayerReady = (payload: object) => {
    dispatch(updateGame(payload));
  };

  useSocketOnListener(gameRoomChannelTopic, PLAYER_READY_EVENT, handleOnPlayerReady);

  useEffect(() => {
    if (!game) {
      navigate(pathTo.demo1.index);
    }
  }, [game]);

  function handleCloseButtonClick(event: React.MouseEvent): void {
    event.preventDefault();

    const shouldDelete = confirm('Want to delete game?');
    const channels = socket == null ? [] : socket.channels;
    const gameLobbyChannel = findChannelTopic(channels, GAME_LOBBY_CHANNEL);

    if (shouldDelete && gameLobbyChannel) {
      gameLobbyChannel.push(DELETE_GAME_EVENT, gameName).receive('error', () => {
        alert(`Game not found for ${gameName}.`);
      });
    }

    if (!gameLobbyChannel) {
      alert('Not connected to game lobby channel.');
    }
  }

  return (
    <div className="relative flex-grow flex justify-center items-center">
      <button className="absolute top-0 right-0 mr-1 text-xl" onClick={handleCloseButtonClick}>
        x
      </button>
      {game && renderGameState(game)}
    </div>
  );
}

export default GameContent;
