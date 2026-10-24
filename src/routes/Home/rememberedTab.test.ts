import { describe, expect, it } from 'vitest';
import {
  initialTab,
  recall,
  remember,
} from './rememberedTab';

function memory() {
  const values = new Map<string, string>();
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => { values.set(key, value); },
  };
}

describe('remember and recall', () => {
  it('gives back the tab and search that were remembered', () => {
    const storage = memory();
    remember({ search: '?name=Frisk', tab: 'favorites' }, storage);
    expect(recall(storage)).toEqual({ search: '?name=Frisk', tab: 'favorites' });
  });

  it('keeps what it was not asked to change', () => {
    const storage = memory();
    remember({ search: '?name=Frisk', tab: 'search' }, storage);
    remember({ tab: 'home' }, storage);
    expect(recall(storage)).toEqual({ search: '?name=Frisk', tab: 'home' });
  });

  it('has nothing at first or for a tab it does not know', () => {
    const storage = memory();
    expect(recall(storage)).toEqual({ search: '', tab: undefined });
    storage.setItem('replay.homeTab', 'settings');
    expect(recall(storage).tab).toBeUndefined();
  });

  it('copes with storage that throws', () => {
    const broken = {
      getItem: () => { throw new Error('blocked'); },
      setItem: () => { throw new Error('blocked'); },
    };
    expect(recall(broken)).toEqual({ search: '', tab: undefined });
    expect(remember({ tab: 'home' }, broken)).toBe(false);
    expect(remember({ tab: 'home' }, memory())).toBe(true);
  });
});

describe('initialTab', () => {
  it('opens a search link on the search tab', () => {
    expect(initialTab(true, '?name=Frisk', { search: '', tab: undefined })).toBe('search');
    expect(initialTab(true, '?name=Frisk', { search: '?name=Chara', tab: 'favorites' })).toBe('search');
  });

  it('returns to the tab you left when the search is the one you left', () => {
    expect(initialTab(true, '?name=Frisk', { search: '?name=Frisk', tab: 'favorites' })).toBe('favorites');
    expect(initialTab(true, '?name=Frisk', { search: '?name=Frisk', tab: 'home' })).toBe('home');
  });

  it('uses the remembered tab, or home, when there is no search', () => {
    expect(initialTab(false, '', { search: '', tab: 'favorites' })).toBe('favorites');
    expect(initialTab(false, '', { search: '', tab: undefined })).toBe('home');
  });
});
