import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import classNames from 'classnames';

import { useAppSelector, useAppDispatch } from 'components/pages/DemoOnePage/app/hooks';
import { useSocketOnListener } from 'components/pages/DemoOnePage/hooks';
import pathTo from 'utils/pathTo';
import {
  addGame,
  removeGame,
  selectGames,
  selectUserName,
  updateGame,
} from 'components/pages/DemoOnePage/app/features/game/gameSlice';
import {
  GAME_OVER,
  PLAYER1_TURN,
  PLAYER2_TURN,
  PLAYERS_READY,
  WAITING_FOR_PLAYERS,
} from 'components/pages/DemoOnePage/contants/rulesStates';
import { GAME_LOBBY_CHANNEL } from 'components/pages/DemoOnePage/contants/channels';
import {
  GAME_CREATED_EVENT,
  GAME_STATE_CHANGED_EVENT,
  GAME_DELETED_EVENT,
} from 'components/pages/DemoOnePage/contants/channelEvents';

export function NoGamesMessage() {
  return (
    <p className="p-1">
      There are not current games.{' '}
      <Link className="underline" to={pathTo.demo1.createGame}>
        click here to create game
      </Link>
    </p>
  );
}

function getGameStatus(ruleState: string): string {
  switch (ruleState) {
    case GAME_OVER:
      return 'game over...';
    case PLAYER1_TURN:
    case PLAYER2_TURN:
      return 'in progress...';
    case PLAYERS_READY:
      return 'ready...';
    case WAITING_FOR_PLAYERS:
      return 'waiting...';
    default:
      throw new Error('Invalid game rule state.');
  }
}

/**
 * Game list component renders a list of games.
 */
function GameList() {
  const games = useAppSelector(selectGames);
  const userName = useAppSelector(selectUserName);
  const { gameName } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleOnGameCreated = (payload: object) => {
    dispatch(addGame(payload));
  };

  useSocketOnListener(GAME_LOBBY_CHANNEL, GAME_CREATED_EVENT, handleOnGameCreated);

  const handleGameStateChanged = (payload: object) => {
    dispatch(updateGame(payload));
  };

  useSocketOnListener(GAME_LOBBY_CHANNEL, GAME_STATE_CHANGED_EVENT, handleGameStateChanged);

  const handleOnGameDeleted = (payload: any) => {
    dispatch(removeGame(payload.game_name));
  };

  useSocketOnListener(GAME_LOBBY_CHANNEL, GAME_DELETED_EVENT, handleOnGameDeleted);

  function handleCreateGameClick(event: React.MouseEvent) {
    event.preventDefault();

    navigate(pathTo.demo1.createGame);
  }

  return (
    <div className="w-1/4 border-r-2 border-green-gecko">
      <div className="flex border-b-2 border-green-gecko p-1 justify-between">
        <h2>Games</h2>
        <button className="mr-1 cursor-pointer" onClick={handleCreateGameClick}>
          +
        </button>
      </div>
      {games.length == 0 ? (
        <NoGamesMessage />
      ) : (
        <ol>
          {games.map((game) => {
            const { game_name, player1, player2 } = game;
            const isInGame =
              userName == player1.name || userName == player2.name ? ' (in game)' : '';
            const linkClass = classNames(
              'block p-1 game-link cursor-pointer flex justify-between items-center',
              {
                active: gameName == game_name,
              },
            );

            return (
              <li key={game_name} className="border-b border-green-gecko">
                <Link to={pathTo.demo1.game(game_name)} className={linkClass}>
                  <p className="truncate">{game_name + isInGame}</p>
                  <span className="text-xs mt-1">{getGameStatus(game.rules.state)}</span>
                </Link>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}

export default GameList;
