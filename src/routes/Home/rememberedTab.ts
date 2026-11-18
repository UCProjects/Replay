export type TabName = 'favorites' | 'home' | 'info' | 'search' | 'shop';

const TAB_KEY = 'replay.homeTab';
const SEARCH_KEY = 'replay.homeSearch';
const TABS: TabName[] = ['favorites', 'home', 'info', 'search', 'shop'];

export type Memory = {
  search: string;
  tab: TabName | undefined;
};

export function recall(storage: Pick<Storage, 'getItem'> = sessionStorage): Memory {
  try {
    const tab = storage.getItem(TAB_KEY);
    return {
      search: storage.getItem(SEARCH_KEY) ?? '',
      tab: TABS.find((name) => name === tab),
    };
  } catch {
    return { search: '', tab: undefined };
  }
}

export function remember(
  values: Partial<Memory>,
  storage: Pick<Storage, 'setItem'> = sessionStorage,
): boolean {
  try {
    if (values.tab !== undefined) storage.setItem(TAB_KEY, values.tab);
    if (values.search !== undefined) storage.setItem(SEARCH_KEY, values.search);
    return true;
  } catch {
    return false;
  }
}

export const TAB_PATHS: Partial<Record<TabName, string>> = {
  favorites: '/favorites',
  info: '/tos',
  shop: '/shop',
};

export function tabOfPath(pathname: string): TabName | undefined {
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
  return TABS.find((tab) => TAB_PATHS[tab] === path);
}

export function initialTab(searching: boolean, search: string, memory: Memory): TabName {
  if (searching) {
    return memory.tab && memory.search === search ? memory.tab : 'search';
  }
  return memory.tab ?? 'home';
}
