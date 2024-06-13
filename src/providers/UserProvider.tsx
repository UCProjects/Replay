import {
  PropsWithChildren,
  ReactNode,
  useEffect,
  useState,
} from 'react';
import { getAuth } from 'firebase/auth';
import { UserContext } from '~/hooks/useUser';
import app from '~/managers/firebase';

const auth = getAuth(app);

export default function UserProvider({
  children,
}: PropsWithChildren): ReactNode {
  const [user, setUser] = useState(auth.currentUser);

  useEffect(() => {
    auth.onAuthStateChanged((newUser) => {
      setUser(newUser);
    });
  }, []);

  return (
    <UserContext.Provider value={user}>
      {children}
    </UserContext.Provider>
  );
}
