import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useAppSelector } from 'components/DemoOnePage/app/hooks';
import { selectGames } from 'components/DemoOnePage/app/features/game/gameSlice';
import pathTo from 'utils/pathTo';

export const NoGamesMessage = () => <p className="p-1">There's not current games. <Link className="underline" to={pathTo.demo1.createGame}>create game</Link></p>;

function GameList() {
  const games = useAppSelector(selectGames);
  const navigate = useNavigate();

  function handleCreateGameClick(event: React.MouseEvent) {
    event.preventDefault();

    navigate(pathTo.demo1.createGame);
  }

  return (
    <div className="w-1/4 border-r-2 border-green-gecko">
      <div className="flex border-b-2 border-green-gecko p-1 justify-between">
        <h2>Games</h2>
        <button className="mr-1 cursor-pointer" onClick={handleCreateGameClick}>+</button>
      </div>
      {
        games.length == 0 ?
        <NoGamesMessage />
        :
        <ol>
          <li>
            game 1
          </li>
        </ol>
      }
    </div>
  );
}

export default GameList;