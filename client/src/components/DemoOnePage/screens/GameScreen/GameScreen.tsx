import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { useAppDispatch } from 'components/DemoOnePage/app/hooks';
import { setGames } from 'components/DemoOnePage/app/features/game/gameSlice';
import { GAME_LOBBY_CHANNEL } from 'components/DemoOnePage/channels';
import { useJoinChannel } from 'components/DemoOnePage/hooks';
import service from 'services/service';

import DefaultContent from './contents/DefaultContent';
import CreateGameContent from './contents/CreateGameContent';
import GameContent from './contents/GameContent';
import GameList from './GameList';
import { CREATE_GAME_CONTENT, GAME_CONTENT } from '../index';

function renderContent(screen: string) {
  switch(screen) {
    case GAME_CONTENT:
      return <GameContent />;
    case CREATE_GAME_CONTENT:
      return <CreateGameContent />;
    default:
      return <DefaultContent />
  }
}

function GameScreen() {
  const [loading, setLoading] = useState(true);
  let { screen: contentScreen, gameName } = useParams();
  const dispatch = useAppDispatch();

  if (gameName) {
    contentScreen = GAME_CONTENT;
  }

  useJoinChannel(GAME_LOBBY_CHANNEL);

  useEffect(() => {
    service.fetchGames()
    .then((response: Response) => response.json())
    .then(data => {
      const { games } = data;

      dispatch(setGames(games));
      setLoading(false);
    });
  }, []);

  if (loading) {
    return null;
  }

  return (
    <div className="w-full flex">
      <GameList />
      {renderContent(contentScreen)}
    </div>
  )
}

export default GameScreen;