import { Context, useContext } from 'react';

export function useContent<T>(context: Context<T>): NonNullable<T> {
  const content = useContext(context);
  if (!content) throw new Error('Used outside of provider');
  return content;
}

export function useNullableContent<T>(context: Context<T>): NonNullable<T> | null {
  const content = useContext(context);
  if (content === undefined) throw new Error('Used outside of provider');
  return content;
}
