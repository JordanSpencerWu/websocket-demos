import React, { useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';

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
  const { screen: contentScreen } = useParams();
  const socket = useContext(SocketContext);

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

  return (
    <div className="w-full flex">
      <GameList />
      {renderContent(contentScreen)}
    </div>
  )
}

export default GameScreen;