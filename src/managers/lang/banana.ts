import Banana from 'banana-i18n';

import messages from '~/assets/lang.json';
import { gameLanguage, savedLanguage } from '~/utils/languages';

function storages() {
  try {
    return { local: localStorage, session: sessionStorage };
  } catch {
    return {};
  }
}

function getLanguage(): string {
  return savedLanguage(storages()) ?? gameLanguage(window.navigator.language);
}

export default new Banana(getLanguage(), { messages });
