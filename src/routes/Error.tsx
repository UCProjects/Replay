import { Box, Button } from '@mui/material';
import { ReactNode } from 'react';
import { isRouteErrorResponse, useRouteError } from 'react-router-dom';

function ErrorMessage(): ReactNode {
  const error = useRouteError();
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
    <Box>
      <ErrorMessage />
      <Button href="/">Return Home</Button>
    </Box>
  );
}
