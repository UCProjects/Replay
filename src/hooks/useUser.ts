import {
  createContext,
  useContext,
} from 'react';
import { User } from 'firebase/auth';

export const UserContext = createContext<User | null>(undefined);

export function useUser(): User | null {
  const user = useContext(UserContext);
  if (user === undefined) {
    throw new Error('Used outside of provider');
  }
  return user;
}

export function useIsAuthed(): boolean {
  const user = useContext(UserContext);
  if (user === undefined) {
    throw new Error('Used outside of provider');
  }
  return user !== null;
}
