import { describe, expect, it } from 'vitest';
import { gameLanguage, saveLanguage, savedLanguage } from './languages';

function storage(values: Record<string, string>) {
  return { getItem: (key: string) => values[key] ?? null };
}

const blocked = {
  getItem: () => { throw new Error('blocked'); },
  setItem: () => { throw new Error('blocked'); },
};

describe('gameLanguage', () => {
  it('keeps a language the game has', () => {
    expect(gameLanguage('fr-FR')).toBe('fr');
    expect(gameLanguage('pt-BR')).toBe('pt');
    expect(gameLanguage('en')).toBe('en');
  });

  it('maps browser codes the game spells differently', () => {
    expect(gameLanguage('zh-CN')).toBe('cn');
    expect(gameLanguage('zh-TW')).toBe('cn');
  });

  it('falls back to English for a language the game does not have', () => {
    expect(gameLanguage('ko-KR')).toBe('en');
    expect(gameLanguage('ja')).toBe('en');
    expect(gameLanguage('tr')).toBe('en');
    expect(gameLanguage('')).toBe('en');
  });
});

describe('savedLanguage', () => {
  it('prefers the session over the saved choice', () => {
    expect(savedLanguage({ local: storage({ language: 'de' }), session: storage({ language: 'fr' }) })).toBe('fr');
    expect(savedLanguage({ local: storage({ language: 'de' }), session: storage({}) })).toBe('de');
  });

  it('has nothing when storage is empty or blocked', () => {
    expect(savedLanguage({ local: storage({}), session: storage({}) })).toBeNull();
    expect(savedLanguage({ local: blocked, session: blocked })).toBeNull();
  });
});

describe('saveLanguage', () => {
  it('reports whether the choice was saved', () => {
    const values: Record<string, string> = {};
    expect(saveLanguage('ru', () => ({ setItem: (key, value) => { values[key] = value; } }))).toBe(true);
    expect(values.language).toBe('ru');
    expect(saveLanguage('ru', () => blocked)).toBe(false);
    expect(saveLanguage('ru', () => { throw new Error('no storage'); })).toBe(false);
  });
});
