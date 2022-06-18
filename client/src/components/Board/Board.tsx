import React from 'react';
import classNames from 'classnames';

type Props = {
  board: Array<Array<string | null>>;
  winningCoordinates: Array<Array<number>>;
  handleClick: (row: number, col: number, value: string) => void;
  isYourTurn: boolean;
};

function getRowColumn(index: number) {
  switch (index) {
    case 0:
      return [0, 0];
    case 1:
      return [0, 1];
    case 2:
      return [0, 2];
    case 3:
      return [1, 0];
    case 4:
      return [1, 1];
    case 5:
      return [1, 2];
    case 6:
      return [2, 0];
    case 7:
      return [2, 1];
    case 8:
      return [2, 2];
    default:
      throw new Error('Invalid index should be between 0 to 8');
  }
}

function isWinCoordinate(coordinates: Array<Array<number>>, coordinate: Array<number>) {
  return coordinates.some((c) => c.join('') == coordinate.join(''));
}

function Board(props: Props) {
  const { board, winningCoordinates, handleClick, isYourTurn } = props;

  const values = board.flatMap((row: Array<string | null>) => row);

  return (
    <div className="grid grid-cols-3 grid-rows-3">
      {values.map((value: string, index: number) => {
        const coordinate = getRowColumn(index);
        const [row, col] = coordinate;

        let isWin = false;
        if (winningCoordinates && isWinCoordinate(winningCoordinates, coordinate)) {
          isWin = true;
        }

        const buttonClass = classNames(
          'w-24 h-24 border-2 border-green-gecko flex justify-center items-center text-4xl',
          {
            'cursor-pointer': !value && isYourTurn,
          },
          {
            win: isWin,
          },
        );

        return (
          <div key={index} className={buttonClass} onClick={() => handleClick(row, col, value)}>
            {value}
          </div>
        );
      })}
    </div>
  );
}

export default Board;
