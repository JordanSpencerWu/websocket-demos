import React from 'react';
import { Outlet } from 'react-router-dom';

import Navbar from 'components/Navbar';

/**
 * Application layout component that defines the layout.
 */
function AppLayout() {
  return (
    <main>
      <Navbar />
      <section className="grid place-items-center h-screen">
        <Outlet />
      </section>
    </main>
  );
}

export default AppLayout;
