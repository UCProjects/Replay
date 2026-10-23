import {
  ChangeEvent,
  FormEvent,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from 'react';

import { useTranslation } from '~/hooks/useTranslation';
import { MODE, GameMode } from '~/types/game';
import { SOUL, Soul } from '~/types/soul';
import {
  MAX_NAME_LENGTH,
  SearchQuery,
  STORY_FIGHTS,
} from '../../searchQuery';
import './nav.css';

export type SearchProps = {
  onSearch: (query: SearchQuery) => void;
  query: SearchQuery;
};

const SOULS = (Object.keys(SOUL) as Soul[]).filter((soul) => soul !== 'MONSTER');
const MODES = (Object.keys(MODE) as GameMode[]).filter((mode) => mode !== 'ANY');

export default function Search({
  onSearch,
  query,
}: SearchProps): ReactNode {
  const t = useTranslation();
  const [draft, setDraft] = useState(query);

  useEffect(() => setDraft(query), [query]);

  const handleName = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setDraft((old) => ({ ...old, id: '', name: value }));
  }, []);

  const handleMode = useCallback((event: ChangeEvent<HTMLSelectElement>) => {
    const mode = event.target.value as GameMode;
    setDraft((old) => ({ ...old, fight: mode === 'STORY' ? old.fight : '', mode }));
  }, []);

  const handleFight = useCallback((event: ChangeEvent<HTMLSelectElement>) => {
    const { value: fight } = event.target;
    setDraft((old) => (fight
      ? {
        ...old, fight, id: '', name: '', soul: 'ANY',
      }
      : { ...old, fight }));
  }, []);

  const handleSoul = useCallback((event: ChangeEvent<HTMLSelectElement>) => {
    const soul = event.target.value as SearchQuery['soul'];
    setDraft((old) => ({ ...old, soul }));
  }, []);

  const handleSubmit = useCallback((event: FormEvent) => {
    event.preventDefault();
    onSearch({
      ...draft,
      id: /^\d+$/.test(draft.id) ? draft.id : '',
      name: draft.name.trim(),
    });
  }, [
    draft,
    onSearch,
  ]);

  return (
    <form className="search-form" onSubmit={handleSubmit}>
      <input
        data-bwignore
        data-lpignore
        disabled={Boolean(draft.fight)}
        id="searchName"
        maxLength={MAX_NAME_LENGTH}
        onChange={handleName}
        placeholder="Username"
        type="text"
        value={draft.name}
      />
      <select
        aria-label="Mode"
        id="searchMode"
        onChange={handleMode}
        value={draft.mode}
      >
        <option value="ANY">Any mode</option>
        {MODES.map((mode) => (
          <option key={mode} value={mode}>{MODE[mode]}</option>
        ))}
      </select>
      {draft.mode === 'STORY' && (
        <select
          aria-label="Fight"
          id="searchFight"
          onChange={handleFight}
          value={draft.fight}
        >
          <option value="">Any fight</option>
          {STORY_FIGHTS.map((fight) => (
            <option key={fight} value={fight}>
              {t(`story-fight-${fight}-name`, { fallback: `Fight ${fight}` })}
            </option>
          ))}
        </select>
      )}
      <select
        aria-label="Soul"
        data-value={draft.soul === 'ANY' ? undefined : SOUL[draft.soul]}
        disabled={Boolean(draft.fight)}
        id="searchSoul"
        onChange={handleSoul}
        value={draft.soul}
      >
        <option value="ANY">Any soul</option>
        {SOULS.map((soul) => (
          <option className={soul} key={soul} value={soul}>{SOUL[soul]}</option>
        ))}
      </select>
      <input id="searchButton" type="submit" value="Search" />
    </form>
  );
}
