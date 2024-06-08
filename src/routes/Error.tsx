import { ReactNode } from 'react';
import { isRouteErrorResponse, useRouteError } from 'react-router-dom';

export default function Error(): ReactNode {
  const error = useRouteError();
  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      const msg = "This page doesn't exist!";
      return <div>{msg}</div>;
    }
  }
  return <div>Something went wrong!</div>;
}
