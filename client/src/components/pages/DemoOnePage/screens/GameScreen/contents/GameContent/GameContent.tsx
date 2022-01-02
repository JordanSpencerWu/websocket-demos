import React, { useContext, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { useAppSelector, useAppDispatch } from 'components/pages/DemoOnePage/app/hooks';
import {
  selectGames,
  selectUserName,
  updateGame,
} from 'components/pages/DemoOnePage/app/features/game/gameSlice';
import { SocketContext } from 'components/pages/DemoOnePage/providers/SocketProvider';
import { useJoinChannel, useSocketOnListener } from 'components/pages/DemoOnePage/hooks';
import pathTo from 'utils/pathTo';
import service from 'services/service';
import {
  GAME_OVER,
  PLAYER1_TURN,
  PLAYER2_TURN,
  PLAYERS_READY,
  WAITING_FOR_PLAYERS,
} from 'components/pages/DemoOnePage/contants/rulesStates';
import {
  DELETE_GAME_EVENT,
  UPDATE_GAME_EVENT,
} from 'components/pages/DemoOnePage/contants/channelEvents';
import {
  findChannelTopic,
  getGameRoomChannel,
  GAME_LOBBY_CHANNEL,
} from 'components/pages/DemoOnePage/contants/channels';

import PlayersReadyState from './PlayersReadyState';
import PlayingState from './PlayingState';
import WaitingState from './WaitingState';

function renderGameState(game: any, gameRoomChannel: any, userName: string) {
  const { rules } = game;

  switch (rules.state) {
    case GAME_OVER:
    case PLAYER1_TURN:
    case PLAYER2_TURN:
      return <PlayingState game={game} gameRoomChannel={gameRoomChannel} userName={userName} />;
    case PLAYERS_READY:
      return (
        <PlayersReadyState game={game} gameRoomChannel={gameRoomChannel} userName={userName} />
      );
    case WAITING_FOR_PLAYERS:
      return <WaitingState game={game} gameRoomChannel={gameRoomChannel} userName={userName} />;
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
  const userName = useAppSelector(selectUserName);

  const game = games.find((game) => game.game_name == gameName);
  const gameRoomChannelTopic = getGameRoomChannel(gameName);
  const channels = socket == null ? [] : socket.channels;
  const gameRoomChannel = findChannelTopic(channels, gameRoomChannelTopic);

  useEffect(() => {
    service
      .fetchGame(gameName)
      .then((response: Response) => response.json())
      .then((game) => dispatch(updateGame(game)));
  }, [gameName]);

  useJoinChannel(gameRoomChannelTopic);

  const handleOnGameUpdate = (payload: object) => {
    dispatch(updateGame(payload));
  };

  useSocketOnListener(gameRoomChannelTopic, UPDATE_GAME_EVENT, handleOnGameUpdate);

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
      <button className="absolute top-0 right-0 mr-1 text-xl p-1" onClick={handleCloseButtonClick}>
        x
      </button>
      {game && renderGameState(game, gameRoomChannel, userName)}
    </div>
  );
}

export default GameContent;
