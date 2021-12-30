import React from 'react';
import debounce from 'lodash.debounce';

import { useAppSelector } from 'components/DemoOnePage/app/hooks';
import { selectUserName } from 'components/DemoOnePage/app/features/game/gameSlice';

type Props = {
  game: any;
}

function playerName(name: string | null) {
  if (name) {
    return name;
  }

  return 'TBA';
}

function WaitingState(props: Props) {
  const { game } = props;

  const userName = useAppSelector(selectUserName);

  const {
    player1,
    player2,
    rules
  } = game;

  let message = "Waiting for two more players";
  if (rules.player1 == 'joined' || rules.player2 == 'joined') {
    message = "Waiting for one more player";
  }

  const isInGame = player1.name == userName || player2.name == userName;
  const buttonText = isInGame ? "Leave" : "Join";

  function handleButtonClick(event: React.MouseEvent): void {
    if (isInGame) {
      console.log('send player join message');
    } else {
      console.log('send player leave message');
    }
  }

  return (
    <div className="flex flex-col text-center">
      <p>{message}</p>
      <p>Player 1: {playerName(player1.name)}</p>
      <p>Player 2: {playerName(player2.name)}</p>
      <button className="mt-8 underline" onClick={debounce(handleButtonClick, 1000)}>{buttonText}</button>
    </div>
  )
}

export default WaitingState;