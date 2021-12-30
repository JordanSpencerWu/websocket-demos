import React, { useEffect, useContext, useState } from 'react';
import { useParams } from 'react-router-dom';

import { useAppDispatch } from 'components/DemoOnePage/app/hooks';
import { addGames } from 'components/DemoOnePage/app/features/game/gameSlice';
import service from 'services/service';

import DefaultScreen from '../DefaultScreen';
import CreateGameScreen from '../CreateGameScreen';
import GameList from './GameList';
import { CREATE_GAME } from '../index';
import { SocketContext } from '../../providers/SocketProvider';
import { GAME_LOBBY_CHANNEL } from '../../channels';

function renderContent(screen: string) {
  switch(screen) {
    case CREATE_GAME:
      return <CreateGameScreen />;
    default:
      return <DefaultScreen />
  }
}

function GameScreen() {
  const [loading, setLoading] = useState(true);
  const { screen: contentScreen } = useParams();
  const dispatch = useAppDispatch();
  const socket = useContext(SocketContext);

  useEffect(() => {
    service.fetchGames()
    .then((response: Response) => response.json())
    .then(data => {
      const { games } = data;

      dispatch(addGames(games));
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