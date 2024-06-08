import {
  LoaderFunctionArgs,
} from 'react-router-dom';

export default async function GameLoader({
  params: {
    gameId,
    step,
  },
  request,
}: LoaderFunctionArgs): Promise<any> {
  await Promise.all([gameId, step, request]);
  return null;
}
