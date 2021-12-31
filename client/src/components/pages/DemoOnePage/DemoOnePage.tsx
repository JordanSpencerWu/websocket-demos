import React from 'react';
import { useParams } from 'react-router-dom';

import { useAppSelector } from 'components/pages/DemoOnePage/app/hooks';
import { selectUserName } from 'components/pages/DemoOnePage/app/features/game/gameSlice';
import SocketProvider from 'components/pages/DemoOnePage/providers/SocketProvider';

import GameScreen from './screens/GameScreen';
import { SignInScreen, WelcomeScreen, SIGN_IN_SCREEN, WELCOME_SCREEN } from './screens';

function renderScreen(screen: string) {
  switch (screen) {
    case SIGN_IN_SCREEN:
      return <SignInScreen />;
    case WELCOME_SCREEN:
      return <WelcomeScreen />;
    default:
      return <GameScreen />;
  }
}

/**
 * Demo 1 page component renders a game using phoenix channels.
 */
function DemoOnePage() {
  let { screen } = useParams();
  const userName = useAppSelector(selectUserName);

  if (!userName && !screen) {
    screen = WELCOME_SCREEN;
  }

  return (
    <SocketProvider>
      <div className="w-2/3 h-2/3 border-2 rounded-sm border-green-gecko flex">
        {renderScreen(screen)}
      </div>
    </SocketProvider>
  );
}

export default DemoOnePage;
