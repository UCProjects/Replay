import {
  createContext,
  useEffect,
  useState,
} from 'react';
import { User } from 'firebase/auth';
import { useNullableContent } from '~/hooks/useContent';
import { identityName } from '~/managers/identity';

export const UserContext = createContext<User | null | undefined>(undefined);

export function useUser(): User | null {
  const user = useNullableContent(UserContext);
  return user;
}

export function useIsAuthed(): boolean {
  const user = useNullableContent(UserContext);
  return user !== null;
}

export function useUserName(): string {
  const user = useNullableContent(UserContext);
  const [name, setName] = useState('');

  useEffect(() => {
    let current = true;
    setName('');
    user?.getIdTokenResult()
      .then(({ claims }) => {
        if (current && typeof claims.name === 'string') setName(claims.name);
      })
      .then(identityName)
      .then((latest) => {
        if (current && latest) setName(latest);
      })
      .catch(() => undefined);
    return () => {
      current = false;
    };
  }, [user]);

  return name || user?.displayName || 'Guest';
}
