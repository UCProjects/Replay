import Banana from 'banana-i18n';

import messages from '../../assets/lang.json';

function getLanguage(): string {
  const lang = sessionStorage.getItem('language') || localStorage.getItem('language');
  if (lang) return lang;
  return window.navigator.language.substring(0, 2);
}

export default new Banana(getLanguage(), { messages });
