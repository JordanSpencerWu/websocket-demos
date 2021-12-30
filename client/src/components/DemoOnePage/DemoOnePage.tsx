import React from 'react';
import { useParams } from 'react-router-dom';

import { useAppSelector } from 'components/DemoOnePage/app/hooks';
import { selectUser } from 'components/DemoOnePage/app/features/game/gameSlice';

import GameScreen from './screens/GameScreen';
import {
  SignInScreen,
  WelcomeScreen,
  SIGN_IN_SCREEN,
  WELCOME_SCREEN
} from './screens';

function renderScreen(screen: string) {
  switch(screen) {
    case SIGN_IN_SCREEN:
      return <SignInScreen />;
    case WELCOME_SCREEN:
      return <WelcomeScreen />;
    default:
      return <GameScreen />;
  }
}

function DemoOnePage() {
  let { screen } = useParams();
  const userName = useAppSelector(selectUser);

  if (!userName && !screen) {
    screen = WELCOME_SCREEN;
  }

  return (
    <div className="w-2/3 h-2/3 border-2 rounded-sm border-green-gecko flex">
      {renderScreen(screen)}
    </div>
  );
}

export default DemoOnePage;