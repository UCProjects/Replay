import { Button } from '@mui/material';
import { ReactNode } from 'react';
import { isRouteErrorResponse, useRouteError } from 'react-router-dom';
import { usePageTitle } from '~/hooks/usePageTitle';
import App from './App';

function ErrorMessage(): ReactNode {
  const error = useRouteError();
  usePageTitle('Error');
  console.error(error);
  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      const msg = "This page doesn't exist!";
      return <div>{msg}</div>;
    }
  }
  return <div>Something went wrong!</div>;
}

export default function Error(): ReactNode {
  return (
    <App>
      <ErrorMessage />
      <Button href="/">Return Home</Button>
    </App>
  );
}
