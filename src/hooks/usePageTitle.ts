import { useEffect } from 'react';

const SITE_NAME = 'Undercards Replay';

export function pageTitle(title?: string): string {
  return title ? `${title} | ${SITE_NAME}` : SITE_NAME;
}

export function usePageTitle(title?: string): void {
  useEffect(() => {
    document.title = pageTitle(title);
  }, [title]);
}
