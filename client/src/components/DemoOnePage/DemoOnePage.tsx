import React from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import WelcomeScreen from './screens/WelcomeScreen';
import SignInScreen from './screens/SignInScreen';
import {
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
      throw new Error('Invalid screen.')
  }
}

function DemoOnePage() {
  const { screen = WELCOME_SCREEN } = useParams();
  const userName = useSelector(state => state.game.userName);

  console.log('testing', userName);

  return (
    <div className="w-2/3 h-2/3 border-2 rounded-sm border-green-gecko flex">
      {renderScreen(screen)}
    </div>
  );
}

export default DemoOnePage;