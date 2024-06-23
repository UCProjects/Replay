import React from 'react';
import { createRoot } from 'react-dom/client';
import {
  RouterProvider,
  createBrowserRouter,
} from 'react-router-dom';

import './index.css';
import App from './routes/App';
import Game from './routes/Game';
import Home from './routes/Home';
import Error from './routes/Error';
import gameLoader from './routes/Game/loader';

const router = createBrowserRouter([{
  path: '/',
  element: <App />,
  errorElement: <Error />,
  children: [{
    path: 'game/:id/',
    element: <Game />,
    loader: gameLoader,
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
