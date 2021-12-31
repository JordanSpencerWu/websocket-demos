import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import classnames from 'classnames';

import Button from 'components/Button';
import { useAppDispatch } from 'components/DemoOnePage/app/hooks';
import { setUserName, setToken } from 'components/DemoOnePage/app/features/game/gameSlice';
import pathTo from 'utils/pathTo';
import service from 'services/service';

/**
 * Sign in screen component displays a form to sign in as a user.
 */
function SignInScreen() {
  const [name, setName] = useState('');
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const showButton = Boolean(name);

  const buttonClass = classnames('mt-8', {
    invisible: !showButton,
  });

  function handleSubmit(event: React.MouseEvent): void {
    event.preventDefault();

    service
      .createToken(name)
      .then((response: Response) => response.json())
      .then((data) => {
        const { token } = data;

        dispatch(setUserName(name));
        dispatch(setToken(token));
        navigate(pathTo.demo1.index);
      });
  }

  return (
    <form className="flex flex-col justify-center items-center w-full">
      <label className="text-2xl mb-2">Enter Username</label>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="text-black"
        type="text"
        autoFocus
      />
      <Button className={buttonClass} to={pathTo.demo1.signIn} onClick={handleSubmit}>
        Sign in
      </Button>
    </form>
  );
}

export default SignInScreen;
