import React from 'react';
import debounce from 'lodash.debounce';
import classNames from 'classnames';

import {
  PLAYER1_TURN,
  PLAYER1,
  PLAYER2_TURN,
  PLAYER2,
  TIE,
} from 'components/pages/DemoOnePage/contants/rulesStates';
import {
  PLAYER_PLAY_AGAIN_EVENT,
  PLAYER_LEAVE_GAME_EVENT,
  PLAYER_PICK_EVENT,
} from 'components/pages/DemoOnePage/contants/channelEvents';
import Board from 'components/Board';

type Props = {
  game: any;
  gameRoomChannel: any;
  userName: string;
};

function getWinMessage(winner: string, youArePlayer1: boolean) {
  if ((winner == PLAYER1 && youArePlayer1) || (winner == PLAYER2 && !youArePlayer1)) {
    return 'You won';
  } else if (winner == TIE) {
    return "It's a tie";
  } else {
    return 'You lost';
  }
}

function PlayingState(props: Props) {
  const { game, gameRoomChannel, userName } = props;

  const { game_board: gameBoard, game_name: gameName, rules, player1, player2, winner } = game;
  const player = player1.name == userName ? PLAYER1 : PLAYER2;
  const isYourTurn =
    (rules.state == PLAYER1_TURN && player1.name == userName) ||
    (rules.state == PLAYER2_TURN && player2.name == userName);

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

  function handleBoardClick(row: number, column: number, value: string) {
    if (!isYourTurn || value) {
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

  function handlePlayAgainClick() {
    if (gameRoomChannel) {
      gameRoomChannel.push(PLAYER_PLAY_AGAIN_EVENT, player).receive('error', () => {
        alert('Failed to play again.');
      });
    }
  }

  const isInGame = player1.name == userName || player2.name == userName;
  const youArePlayer1 = player1.name == userName;
  const yourValue = youArePlayer1 ? 'X' : 'O';

  let message = "Other player's turn";
  if (isYourTurn) {
    message = 'Your turn';
  }
  if (!isInGame) {
    message = rules.state == PLAYER1_TURN ? `${player1.name}'s turn` : `${player2.name}'s turn`;
  }

  const buttonClass = classNames('w-1/4 mt-8 border border-green-gecko rounded', {
    invisible: !isInGame,
  });

  const winMessage = getWinMessage(winner, youArePlayer1);

  return (
    <div className="w-full flex flex-col text-center justify-center items-center">
      <h1 className="text-4xl mb-1">{gameName}</h1>
      {winner ? <p>{winMessage}</p> : <p className="">{message}</p>}
      <p className="mb-4">{`You're value: ${yourValue}`}</p>
      <Board board={gameBoard} handleClick={handleBoardClick} isYourTurn={isYourTurn} />
      {winner && (
        <button className={buttonClass} onClick={debounce(handlePlayAgainClick, 200)}>
          Play Agin
        </button>
      )}
      <button className={buttonClass} onClick={debounce(handleLeaveButtonClick, 200)}>
        Leave
      </button>
    </div>
  );
}

export default PlayingState;
