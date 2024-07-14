import {
  createContext,
} from 'react';
import { User } from 'firebase/auth';
import { useNullableContent } from '~/hooks/useContent';

export const UserContext = createContext<User | null | undefined>(undefined);

export function useUser(): User | null {
  const user = useNullableContent(UserContext);
  return user;
}

export function useIsAuthed(): boolean {
  const user = useNullableContent(UserContext);
  return user !== null;
}
