import React from 'react';
import { Routes, Route } from 'react-router-dom';

import AppLayout from 'components/AppLayout';
import WelcomePage from 'components/WelcomePage';
import NoMatchPage from 'components/NoMatchPage';

/**
 * Application component that defines the routes.
 */
function App() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<WelcomePage />} />
        <Route path="*" element={<NoMatchPage />} />
      </Route>
    </Routes>
  );
}

export default App;
