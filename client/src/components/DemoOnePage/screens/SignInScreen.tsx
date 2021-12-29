import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import classnames from 'classnames';

import Button from 'components/Button';
import pathTo from 'utils/pathTo';
import service from 'services/service';

import { useAppDispatch } from '../app/hooks';
import { addUserName, addToken } from '../app/features/game/gameSlice';

function SignInScreen() {
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const showButton = Boolean(userName);

  const buttonClass = classnames(
    'mt-8',
    {
      invisible: !showButton
    }
  )

  function handleSubmit(event: React.MouseEvent): void {
    event.preventDefault();

    service.createToken("test")
    .then((response: Response) => response.json())
    .then(data => {
      const { token } = data;

      dispatch(addUserName(userName));
      dispatch(addToken(token));
      navigate(pathTo.demo1.index);
    });
  }

  return (
    <form className="flex flex-col justify-center items-center w-full">
      <label className="text-2xl mb-2">Enter Username</label>
      <input
        value={userName}
        onChange={e => setUserName(e.target.value)}
        className="text-black"
        type="text"
        autoFocus
      />
      <Button
        className={buttonClass}
        to={pathTo.demo1.signIn}
        onClick={handleSubmit}
      >
        Sign in
      </Button>
    </form>
  );
}

export default SignInScreen;