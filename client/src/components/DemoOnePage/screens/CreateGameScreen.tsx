import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import classnames from 'classnames';

import Button from 'components/Button';
import pathTo from 'utils/pathTo';

import { SocketContext } from '../providers/SocketProvider';
import { findChannelTopic, GAME_LOBBY_CHANNEL } from '../channels';
import { CREATE_GAME_EVENT } from '../channelEvents';

function CreateGameScreen() {
  const [gameName, setGameName] = useState('');
  const navigate = useNavigate();
  const socket = useContext(SocketContext);

  const showButton = Boolean(gameName);

  const buttonClass = classnames(
    'mt-8',
    'cursor-pointer',
    {
      invisible: !showButton
    }
  )

  function handleSubmit(event: React.MouseEvent): void {
    event.preventDefault();
    
    if (socket != null) {
      const gameLobbyChannel = findChannelTopic(socket, GAME_LOBBY_CHANNEL);

      gameLobbyChannel.push(CREATE_GAME_EVENT, gameName);
    }

    navigate(pathTo.demo1.index);
  }

  function handleClose(): void {
    navigate(pathTo.demo1.index);
  }

  return (
    <form className="flex-grow flex flex-col justify-center items-center relative">
      <button className="absolute top-0 right-0 mr-2 text-lg" onClick={handleClose}>x</button>
      <label className="text-2xl mb-2">Create Game</label>
      <input
        value={gameName}
        onChange={e => setGameName(e.target.value)}
        className="text-black"
        type="text"
        autoFocus
      />
      <Button
        className={buttonClass}
        onClick={handleSubmit}
      >
        Create
      </Button>
    </form>
  );
}

export default CreateGameScreen;