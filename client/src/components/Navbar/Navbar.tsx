import React from 'react';
import { NavLink, useMatch, useResolvedPath } from 'react-router-dom'; 

/**
 * Navbar component that defines the navigation links.
 */
function Navbar() {
  // const resolved = useResolvedPath(to);
  // const match = useMatch({ path: resolved.pathname, end: true });

  return (
    <div className="fixed w-full flex flex-col justify-center items-center">
      <h1 className="text-6xl mt-2">Websocket Demo</h1>
      <nav className="text-xl underline">
        <NavLink to="/" className="border-r-2 pr-1 border-green-gecko">Home</NavLink>
        <NavLink to="/demo-1" className="ml-1 border-r-2 pr-1 border-green-gecko">Phoneix Channel Demo</NavLink>
        <NavLink to="/demo-2" className="ml-1">GraphQL Subscription Demo</NavLink>
      </nav>
    </div>
  )
}

export default Navbar;