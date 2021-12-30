import React from 'react';
import { NavLink } from 'react-router-dom';

import pathTo from 'utils/pathTo';

/**
 * Navbar component that defines the navigation links.
 */
function Navbar() {
  return (
    <div className="fixed w-full flex flex-col justify-center items-center">
      <h1 className="text-6xl mt-2">Websocket Demo</h1>
      <nav className="text-xl underline">
        <NavLink to={pathTo.home} className="border-r-2 pr-1 border-green-gecko">Home</NavLink>
        <NavLink to={pathTo.demo1.index} className="ml-1 border-r-2 pr-1 border-green-gecko">Phoenix Channel Demo</NavLink>
        <NavLink to={pathTo.demo2.index} className="ml-1">GraphQL Subscription Demo</NavLink>
      </nav>
    </div>
  )
}

export default Navbar;