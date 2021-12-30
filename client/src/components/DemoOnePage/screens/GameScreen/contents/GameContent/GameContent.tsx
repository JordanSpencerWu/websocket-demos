import React from 'react';
import { useParams } from 'react-router-dom';

import { useAppSelector } from 'components/DemoOnePage/app/hooks';
import { selectUserName, selectGames } from 'components/DemoOnePage/app/features/game/gameSlice';
import { WAITING_FOR_PLAYERS } from 'components/DemoOnePage/rulesStates';

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
  const { gameName } = useParams();
  const userName = useAppSelector(selectUserName);
  const userNameText = `username: ${userName}`;
  const games = useAppSelector(selectGames);
  const game = games.find(game => game.game_name == gameName);

  return (
    <div className="relative flex-grow flex justify-center items-center">
      <span className="absolute top-0 left-0 ml-1">{userNameText}</span>
      {renderGameState(game)}
    </div>
  )
}

export default GameContent;