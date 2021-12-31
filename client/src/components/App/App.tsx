import React from 'react';
import { Routes, Route } from 'react-router-dom';

import AppLayout from 'components/AppLayout';
import WelcomePage from 'components/WelcomePage';
import NoMatchPage from 'components/NoMatchPage';
import DemoOnePage from 'components/DemoOnePage';

/**
 * Application component that defines the routes.
 */
function App() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<WelcomePage />} />
        <Route path="demo-1">
          <Route path="" element={<DemoOnePage />} />
          <Route path=":screen" element={<DemoOnePage />} />
          <Route path="game/:gameName" element={<DemoOnePage />} />
        </Route>
        <Route path="*" element={<NoMatchPage />} />
      </Route>
    </Routes>
  );
}

export default App;
