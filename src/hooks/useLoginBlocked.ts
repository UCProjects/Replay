import { useEffect, useState } from 'react';
import { domainAuthorized } from '~/managers/identity';

const UNAUTHORIZED = 'Sign-in is not enabled on this domain';

export function useLoginBlocked(): string | undefined {
  const [blocked, setBlocked] = useState<string | undefined>(undefined);

  useEffect(() => {
    let current = true;
    domainAuthorized().then((authorized) => {
      if (current) setBlocked(authorized ? undefined : UNAUTHORIZED);
    }).catch(() => undefined);
    return () => {
      current = false;
    };
  }, []);

  return blocked;
}
