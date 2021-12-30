import React, { useContext, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import classNames from 'classnames';

import { useAppSelector, useAppDispatch } from 'components/DemoOnePage/app/hooks';
import { selectGames, addGame } from 'components/DemoOnePage/app/features/game/gameSlice';
import { GAME_CREATED_EVENT } from 'components/DemoOnePage/channelEvents';
import { SocketContext } from 'components/DemoOnePage/providers/SocketProvider';
import { findChannelTopic, GAME_LOBBY_CHANNEL } from 'components/DemoOnePage/channels';
import { WAITING_FOR_PLAYERS } from 'components/DemoOnePage/rulesStates';
import pathTo from 'utils/pathTo';


export function NoGamesMessage() {
  return (
    <p className="p-1">There are not current games. <Link className="underline" to={pathTo.demo1.createGame}>click here to create game</Link></p>
  );
}

function getGameStatus(ruleState: string): string {
  switch(ruleState) {
    case WAITING_FOR_PLAYERS:
      return 'waiting...';
    default:
      throw new Error('Invalid game rule state.');
  }
}

function GameList() {
  const games = useAppSelector(selectGames);
  const { gameName } = useParams();
  const navigate = useNavigate();
  const socket = useContext(SocketContext);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const handleOnGameCreated = (game: object) => {
      dispatch(addGame(game));
    }

    let handleRef: () => void;
    let gameLobbyChannel: any;
    if (socket != null) {
      gameLobbyChannel = findChannelTopic(socket, GAME_LOBBY_CHANNEL);
      handleRef = gameLobbyChannel.on(GAME_CREATED_EVENT, handleOnGameCreated);
    }

    return () => {
      if (gameLobbyChannel) {
        gameLobbyChannel.off(GAME_CREATED_EVENT, handleRef);
      }
    }
  }, [socket]);

  function handleCreateGameClick(event: React.MouseEvent) {
    event.preventDefault();

    navigate(pathTo.demo1.createGame);
  }

  return (
    <div className="w-1/4 border-r-2 border-green-gecko">
      <div className="flex border-b-2 border-green-gecko p-1 justify-between">
        <h2>Games</h2>
        <button className="mr-1 cursor-pointer" onClick={handleCreateGameClick}>+</button>
      </div>
      {
        games.length == 0 ?
        <NoGamesMessage />
        :
        <ol>
          {
            games.map(game => {
              const { game_name } = game;
              const linkClass = classNames(
                "block p-1 game-link cursor-pointer flex justify-between items-center",
                {
                  "active": gameName == game_name
                }
              )

              return (
                <li key={game_name} className="border-b border-green-gecko">
                  <Link
                    to={pathTo.demo1.game(game_name)}
                    className={linkClass}
                  >
                    {game_name}
                    <span className="text-xs">{getGameStatus(game.rules.state)}</span>
                  </Link>
                </li>
              );
            })
          }
        </ol>
      }
    </div>
  );
}

export default GameList;