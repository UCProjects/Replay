import {
  PropsWithChildren,
  ReactNode,
  useEffect,
  useState,
} from 'react';
import { getAuth } from 'firebase/auth';
import app from '../managers/firebase';
import { UserContext } from '../hooks/useUser';

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
