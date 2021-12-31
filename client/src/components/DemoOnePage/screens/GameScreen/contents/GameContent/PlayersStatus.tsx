import React from 'react';

type Props = {
  game: any;
  userName: string;
};

export function getPlayerStatus(name: string | null, currentUserName: string) {
  const isYou = name == currentUserName;

  let playerName = 'TBA';
  if (name) {
    playerName = name;
  }

  if (playerName && isYou) {
    playerName += ' (You)';
  }

  return playerName;
}

function PlayersStatus(props: Props) {
  const { game, userName } = props;

  const { player1, player2, rules } = game;

  let player1Name = player1.name || 'TBA';
  let player2Name = player2.name || 'TBA';
  const player1IsReady = rules.player1 == 'ready' ? ' is ready' : '';
  const player2IsReady = rules.player2 == 'ready' ? ' is ready' : '';

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
