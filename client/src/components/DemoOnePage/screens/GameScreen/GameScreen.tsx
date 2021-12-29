import React from 'react';
import { useParams } from 'react-router-dom';

import DefaultScreen from '../DefaultScreen';

import GameList from './GameList';
import { CREATE_GAME } from '../index';

function renderContent(screen: string) {
  switch(screen) {
    case CREATE_GAME:
      return <div>CREATE GAME</div>;
    default:
      return <DefaultScreen />
  }
}

function GameScreen() {
  const { screen: contentScreen } = useParams();

  console.log(contentScreen);

  return (
    <div className="w-full flex">
      <GameList />
      {renderContent(contentScreen)}
    </div>
  )
}

export default GameScreen;