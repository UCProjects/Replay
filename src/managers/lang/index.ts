import getOptional from '~/utils/getOptional';
import banana from './banana';
import getFile from './getFile';
import { plugins } from './plugins';
import { Nodes } from './utils';

const cache = new Map<string, Record<string, string>>();

export function hasLoaded(): boolean {
  return cache.size > 0;
}

export async function loadLanguage(key: DocumentKey): Promise<void> {
  if (!key) Promise.reject(new Error('No translation key provided'));
  if (cache.has(key)) {
    return banana.load(cache.get(key)!);
  }
  try {
    const data = await getFile(key);
    cache.set(key, data);
    return banana.load(data);
  } catch (err) {
    console.error(err);
    throw new Error(`[${key}] Translation does not exist`);
  }
}

export type TranslateOptions = {
  fallback: string,
};
export function translate(message: string, ...args: Optional<string[], TranslateOptions>): string {
  const {
    fallback = '',
  } = getOptional<TranslateOptions, typeof args>(args);
  try {
    const text = banana.i18n(message, ...args);
    return text === message ? fallback : text;
  } catch (e) {
    console.error(e);
    return 'Translation error';
  }
}

Object.keys(plugins).forEach((key) => {
  const val = plugins[key];
  if (typeof val !== 'function') return;
  banana.registerParserPlugin(key, (nodes) => val(nodes as Nodes, translate));
});
