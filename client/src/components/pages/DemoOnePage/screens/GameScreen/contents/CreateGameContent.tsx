import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import classnames from 'classnames';

import Button from 'components/Button';
import pathTo from 'utils/pathTo';
import { CREATE_GAME_EVENT } from 'components/pages/DemoOnePage/contants/channelEvents';
import { SocketContext } from 'components/pages/DemoOnePage/providers/SocketProvider';
import {
  findChannelTopic,
  GAME_LOBBY_CHANNEL,
} from 'components/pages/DemoOnePage/contants/channels';

/**
 * Create game content component displays form to create a new game.
 */
function CreateGameContent() {
  const [gameName, setGameName] = useState('');
  const navigate = useNavigate();
  const socket = useContext(SocketContext);

  const showButton = Boolean(gameName);

  const buttonClass = classnames('mt-8', 'cursor-pointer', {
    invisible: !showButton,
  });

  function handleSubmit(event: React.FormEvent<HTMLFormElement> | React.MouseEvent): void {
    event.preventDefault();

    const channels = socket == null ? [] : socket.channels;
    const gameLobbyChannel = findChannelTopic(channels, GAME_LOBBY_CHANNEL);

    if (gameLobbyChannel) {
      gameLobbyChannel
        .push(CREATE_GAME_EVENT, gameName)
        .receive('ok', () => {
          navigate(pathTo.demo1.index);
        })
        .receive('error', () => {
          alert(`The game name ${gameName} already existed please create a different one.`);
        });
    } else {
      alert('Not connected to game lobby channel.');
    }
  }

  function handleClose(): void {
    navigate(pathTo.demo1.index);
  }

  return (
    <form
      className="flex-grow flex flex-col justify-center items-center relative"
      onSubmit={handleSubmit}
    >
      <a className="absolute top-0 right-0 mr-2 text-lg p-1 cursor-pointer" onClick={handleClose}>
        x
      </a>
      <label className="text-2xl mb-2">Create Game</label>
      <input
        value={gameName}
        onChange={(e) => setGameName(e.target.value)}
        className="text-black"
        type="text"
        autoFocus
      />
      <Button type="submit" className={buttonClass} onClick={handleSubmit}>
        Create
      </Button>
    </form>
  );
}

export default CreateGameContent;
