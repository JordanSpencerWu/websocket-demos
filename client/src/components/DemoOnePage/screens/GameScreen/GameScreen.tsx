import React, { useEffect, useContext, useState } from 'react';
import { useParams } from 'react-router-dom';

import { useAppDispatch } from 'components/DemoOnePage/app/hooks';
import { setGames } from 'components/DemoOnePage/app/features/game/gameSlice';
import { SocketContext } from 'components/DemoOnePage/providers/SocketProvider';
import { GAME_LOBBY_CHANNEL } from 'components/DemoOnePage/channels';
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
  const socket = useContext(SocketContext);

  if (gameName) {
    contentScreen = GAME_CONTENT;
  }

  useEffect(() => {
    service.fetchGames()
    .then((response: Response) => response.json())
    .then(data => {
      const { games } = data;

      dispatch(setGames(games));
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    let channel: any;

    if (socket != null) {
      channel = socket.channel(GAME_LOBBY_CHANNEL);
      channel.join();
    }

    return () => {
      if (channel) {
        channel.leave();
      }
    }
  }, [socket])

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