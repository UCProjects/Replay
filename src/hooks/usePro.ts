import { getAuth, onIdTokenChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';
import app from '~/managers/firebase';
import { proStatus } from '~/utils/plans';

const auth = getAuth(app);

export function usePro(): boolean | undefined {
  const [pro, setPro] = useState<boolean | undefined>(undefined);

  useEffect(() => onIdTokenChanged(auth, (user) => {
    if (!user) {
      setPro(false);
      return;
    }
    user.getIdTokenResult()
      .then(({ claims }) => {
        if (auth.currentUser === user) setPro(proStatus(claims.pro).kind !== 'none');
      })
      .catch(() => setPro(false));
  }), []);

  return pro;
}
