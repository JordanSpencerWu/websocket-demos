import { CREATE_GAME_CONTENT, SIGN_IN_SCREEN } from 'components/DemoOnePage/screens/index';

export default {
  home: '/',
  demo1: {
    index: '/demo-1',
    signIn: `/demo-1/${SIGN_IN_SCREEN}`,
    createGame: `/demo-1/${CREATE_GAME_CONTENT}`,
    game: (gameName: string) => `/demo-1/game/${gameName}`,
  },
  demo2: {
    index: '/demo-2',
  },
};
