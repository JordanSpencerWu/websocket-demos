import React, { useContext, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { useAppSelector } from 'components/DemoOnePage/app/hooks';
import { selectUserName, selectGames } from 'components/DemoOnePage/app/features/game/gameSlice';
import { WAITING_FOR_PLAYERS } from 'components/DemoOnePage/rulesStates';
import { DELETE_GAME_EVENT } from 'components/DemoOnePage/channelEvents';
import { SocketContext } from 'components/DemoOnePage/providers/SocketProvider';
import { findChannelTopic, GAME_LOBBY_CHANNEL } from 'components/DemoOnePage/channels';
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
  const navigate = useNavigate();
  const { gameName } = useParams();
  const userName = useAppSelector(selectUserName);
  const games = useAppSelector(selectGames);

  const userNameText = `username: ${userName}`;
  const game = games.find(game => game.game_name == gameName);

  useEffect(() => {
    if (!game) {
      navigate(pathTo.demo1.index);
    }
  }, [game]);

  function handleCloseButtonClick(event: React.MouseEvent): void {
    event.preventDefault();

    const shouldDelete = confirm("Want to delete game?");
    
    if (shouldDelete && socket != null) {
      const gameLobbyChannel = findChannelTopic(socket, GAME_LOBBY_CHANNEL);
  
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