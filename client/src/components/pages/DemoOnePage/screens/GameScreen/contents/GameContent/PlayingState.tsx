import React from 'react';
import debounce from 'lodash.debounce';
import classNames from 'classnames';

import {
  PLAYER1,
  PLAYER2,
  PLAYER1_TURN,
  PLAYER2_TURN,
} from 'components/pages/DemoOnePage/contants/rulesStates';
import {
  PLAYER_LEAVE_GAME_EVENT,
  PLAYER_PICK_EVENT,
} from 'components/pages/DemoOnePage/contants/channelEvents';
import Board from 'components/Board';

type Props = {
  game: any;
  gameRoomChannel: any;
  userName: string;
};

function PlayingState(props: Props) {
  const { game, gameRoomChannel, userName } = props;

  const { game_board: gameBoard, game_name: gameName, rules, player1, player2 } = game;
  const isInGame = player1.name == userName || player2.name == userName;
  const isYourTurn =
    (rules.state == PLAYER1_TURN && player1.name == userName) ||
    (rules.state == PLAYER2_TURN && player2.name == userName);
  const youArePlayer1 = player1.name == userName;
  const player = player1.name == userName ? PLAYER1 : PLAYER2;
  const yourValue = youArePlayer1 ? 'X' : 'O';

  let message = "Other player's turn";
  if (isYourTurn) {
    message = 'Your turn';
  }
  if (!isInGame) {
    message = rules.state == PLAYER1_TURN ? `${player1.name}'s turn` : `${player2.name}'s turn`;
  }

  const leaveButtonClass = classNames('w-1/4 mt-8 border border-green-gecko rounded', {
    invisible: !isInGame,
  });

  function handleLeaveButtonClick(event: React.MouseEvent): void {
    event.preventDefault();

    if (gameRoomChannel) {
      gameRoomChannel.push(PLAYER_LEAVE_GAME_EVENT, player).receive('error', () => {
        alert('Failed to leave game.');
      });
    } else {
      alert('Not connected to game room channel.');
    }
  }

  function handleBoardClick(row: number, column: number) {
    if (!isYourTurn) {
      return;
    }

    if (gameRoomChannel) {
      const payload = { player, row, column };

      gameRoomChannel.push(PLAYER_PICK_EVENT, payload).receive('error', () => {
        alert('Failed to pick.');
      });
    } else {
      alert('Not connected to game room channel.');
    }
  }

  return (
    <div className="w-full flex flex-col text-center justify-center items-center">
      <h1 className="text-4xl mb-1">{gameName}</h1>
      <p className="">{message}</p>
      <p className="mb-4">{`You're value: ${yourValue}`}</p>
      <Board board={gameBoard} handleClick={handleBoardClick} isYourTurn={isYourTurn} />
      <button className={leaveButtonClass} onClick={debounce(handleLeaveButtonClick, 200)}>
        Leave
      </button>
    </div>
  );
}

export default PlayingState;
