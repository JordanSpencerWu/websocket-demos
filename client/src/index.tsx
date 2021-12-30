import React from 'react';
import { Provider } from 'react-redux';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import App from 'components/App';
import store from 'components/DemoOnePage/app/store';
import SocketProvider from 'components/DemoOnePage/providers/SocketProvider';

import './style.css';

render(
  <React.StrictMode>
    <Provider store={store}>
      <SocketProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </SocketProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root'),
);
