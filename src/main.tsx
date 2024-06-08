import React from 'react';
import { createRoot } from 'react-dom/client';
import {
  RouterProvider,
  createBrowserRouter,
} from 'react-router-dom';

import './index.css';
import App from './routes/App';
import Game, { loader } from './routes/Game';
import Home from './routes/Home';

const router = createBrowserRouter([{
  path: '/',
  element: <App />,
  children: [{
    path: 'game/:id/:step?',
    element: <Game />,
    loader,
  }, {
    path: '',
    element: <Home />,
  }],
}]);

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
