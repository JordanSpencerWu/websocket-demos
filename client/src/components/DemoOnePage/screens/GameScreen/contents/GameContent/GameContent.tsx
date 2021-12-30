import React, { useContext, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { useAppSelector, useAppDispatch } from 'components/DemoOnePage/app/hooks';
import { selectUserName, selectGames, updateGame } from 'components/DemoOnePage/app/features/game/gameSlice';
import { WAITING_FOR_PLAYERS } from 'components/DemoOnePage/rulesStates';
import { DELETE_GAME_EVENT, PLAYER_JOINED_GAME_EVENT } from 'components/DemoOnePage/channelEvents';
import { SocketContext } from 'components/DemoOnePage/providers/SocketProvider';
import { useJoinChannel, useSocketOnListener } from 'components/DemoOnePage/hooks';
import { findChannelTopic, GAME_LOBBY_CHANNEL, getGameRoomChannel } from 'components/DemoOnePage/channels';
import pathTo from 'utils/pathTo';

import WaitingState from './WaitingState';

function renderGameState(game: any) {
  const { rules } = game;

  switch(rules.state) {
    case WAITING_FOR_PLAYERS:
      return <WaitingState game={game} />;
    default:
      throw new Error('Invalid game rule state.');
  }
}

function GameContent() {
  const socket = useContext(SocketContext);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { gameName } = useParams();
  const userName = useAppSelector(selectUserName);
  const games = useAppSelector(selectGames);

  const userNameText = `username: ${userName}`;
  const game = games.find(game => game.game_name == gameName);
  const gameRoomChannelTopic = getGameRoomChannel(gameName);

  useJoinChannel(gameRoomChannelTopic);

  const handleOnPlayerJoined = (payload: object) => {
    dispatch(updateGame(payload));
  }

  useSocketOnListener(gameRoomChannelTopic, PLAYER_JOINED_GAME_EVENT, handleOnPlayerJoined);

  useEffect(() => {
    if (!game) {
      navigate(pathTo.demo1.index);
    }
  }, [game]);

  function handleCloseButtonClick(event: React.MouseEvent): void {
    event.preventDefault();

    const shouldDelete = confirm("Want to delete game?");
    const channels = socket == null ? [] : socket.channels;
    const gameLobbyChannel = findChannelTopic(channels, GAME_LOBBY_CHANNEL);
    
    if (shouldDelete && gameLobbyChannel) {
      gameLobbyChannel.push(DELETE_GAME_EVENT, gameName)
      .receive("error", () => {
        alert(`Game not found for ${gameName}.`)
      });
    }
  }

  return (
    <div className="relative flex-grow flex justify-center items-center">
      <span className="absolute top-0 left-0 ml-1">{userNameText}</span>
      <button className="absolute top-0 right-0 mr-1 text-xl" onClick={handleCloseButtonClick}>x</button>
      {game && renderGameState(game)}
    </div>
  )
}

export default GameContent;