import React, { useState } from 'react';
import classnames from 'classnames';

import Button from 'components/Button';


function CreateGameScreen() {
  const [gameName, setGameName] = useState('');

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
  }

  return (
    <form className="flex-grow flex flex-col justify-center items-center">
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