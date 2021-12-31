import React from 'react';

import { useAppSelector } from 'components/DemoOnePage/app/hooks';
import { selectGames } from 'components/DemoOnePage/app/features/game/gameSlice';

import { NoGamesMessage } from '../GameList';

/**
 * Default content component displays the default content.
 */
function DefaultContent() {
  const games = useAppSelector(selectGames);

  return (
    <div className="flex-grow flex justify-center items-center">
      {games.length == 0 ? <NoGamesMessage /> : <p>Please select a game to join or watch</p>}
    </div>
  );
}

export default DefaultContent;
