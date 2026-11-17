type Storage = Pick<globalThis.Storage, 'getItem' | 'setItem'>;

export type BooleanSetting = {
  get: () => boolean;
  set: (value: boolean) => boolean;
};

export function booleanSetting(
  key: string,
  fallback: boolean,
  storage: () => Storage = () => localStorage,
): BooleanSetting {
  return {
    get() {
      try {
        const stored = storage().getItem(key);
        return stored === null ? fallback : stored === 'true';
      } catch {
        return fallback;
      }
    },
    set(value) {
      try {
        storage().setItem(key, `${value}`);
        return true;
      } catch {
        return false;
      }
    },
  };
}

export const playOnLoad = booleanSetting('replay.playOnLoad', true);
