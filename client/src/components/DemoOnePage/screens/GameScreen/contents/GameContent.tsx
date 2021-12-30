import React from 'react';
import { useParams } from 'react-router-dom';

import { useAppSelector } from 'components/DemoOnePage/app/hooks';
import { selectUserName, selectGames } from 'components/DemoOnePage/app/features/game/gameSlice';

function GameContent() {
  const { gameName } = useParams();
  const userName = useAppSelector(selectUserName);
  const userNameText = `username: ${userName}`;
  const games = useAppSelector(selectGames);
  const game = games.find(game => game.game_name == gameName);
  const { game_name } = game;

  return (
    <div className="relative flex-grow flex justify-center items-center">
      <span className="absolute top-0 left-0 ml-1">{userNameText}</span>
      {game_name}
    </div>
  )
}

export default GameContent;