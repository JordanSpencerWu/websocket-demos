import React from 'react';

import { PLAYER_IS_READY } from 'components/pages/DemoOnePage/contants/rulesStates';

type Props = {
  game: any;
  userName: string;
};

/**
 * Players status component displays the status of each player.
 */
function PlayersStatus(props: Props) {
  const { game, userName } = props;

  const { player1, player2, rules } = game;

  let player1Name = player1.name || 'TBA';
  let player2Name = player2.name || 'TBA';
  const player1IsReady = rules.player1 == PLAYER_IS_READY ? ' is ready' : '';
  const player2IsReady = rules.player2 == PLAYER_IS_READY ? ' is ready' : '';

  if (player1Name == userName) {
    player1Name += ' (You)';
  }

  if (player2Name == userName) {
    player2Name += ' (You)';
  }

  return (
    <>
      <p>{`Player 1${player1IsReady}: ${player1Name}`}</p>
      <p>{`Player 2${player2IsReady}: ${player2Name}`}</p>
    </>
  );
}

export default PlayersStatus;
