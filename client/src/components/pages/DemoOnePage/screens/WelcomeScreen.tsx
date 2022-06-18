import React from 'react';
import { Link } from 'react-router-dom';

import pathTo from 'utils/pathTo';

/**
 * Welcome screen component displays a welcome message.
 */
function WelcomeScreen() {
  return (
    <section className="flex flex-col justify-center items-center w-full">
      <h1 className="text-2xl">Welcome to the Phoenix Channel Demo!!</h1>
      <p className="mt-6 w-2/3 text-center">
        In this demo we will be using phoenix channel in a multiple player setting. Users can create
        and join games. Each game is a tic tac toe game that can be played between two players.
      </p>
      <Link className="mt-8 underline" to={pathTo.demo1.signIn}>
        Continue
      </Link>
    </section>
  );
}

export default WelcomeScreen;
