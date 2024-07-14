import { Plugin } from './types';
import {
  getKey,
  getText,
  parse,
  switchHandler,
} from './utils';

export const plugins: Record<string, Plugin> = {
  ucp([amt]) {
    return getText(amt, 'ucp');
  },
  tribe(nodes, translate) {
    const { args, override, empty } = parse(nodes);
    if (empty) return '';
    const text = override || translate(getKey('tribe', args[0]), args[1] || '1');
    return getText(text, 'underlined');
  },
  soul(nodes, translate) {
    const { args, override, empty } = parse(nodes);
    if (empty) return '';
    const text = override || translate(getKey('soul', args[0].replace(/_/g, '-')));
    return getText(text, args[0]);
  },
  kw(nodes, translate) {
    const { args, override, empty } = parse(nodes);
    if (empty) return '';
    const text = override || translate(getKey('kw', args[0]));
    return getText(text, 'underlined');
  },
  artifact(nodes, translate) {
    const { args: [id, ex = false], override, empty } = parse(nodes);
    if (empty) return '';
    const desc = ex === 'desc';
    const text = override || translate(getKey(`artifact${desc ? '' : '-name'}`, id));
    return getText(text, desc ? '' : `underlined${ex ? ' bold LEGENDARY' : ''}`);
  },
  hp(nodes, translate) {
    const { args: [number], override } = parse(nodes);
    const text = override || translate('stat-hp', number || '1');
    return `${number ? `${number} ` : ''}${getText(text, 'green')}`;
  },
  atk(nodes, translate) {
    const { args: [number], override } = parse(nodes);
    const text = override || translate('stat-atk', number || '1');
    return `${number ? `${number} ` : ''}${getText(text, 'red')}`;
  },
  gold(nodes, translate) {
    const { args: [number], override } = parse(nodes);
    const text = override || translate('stat-gold', number || '1');
    return `${number ? `${number} ` : ''}${getText(text, 'yellow')}`;
  },
  cost(nodes, translate) {
    const { args: [number], override } = parse(nodes);
    const text = override || translate('stat-cost', number || '1');
    return `${number ? `${number} ` : ''}${getText(text, 'blue')}`;
  },
  kr(nodes, translate) {
    const { override } = parse(nodes);
    const text = override || translate('stat-kr');
    return getText(text, 'PERSEVERANCE');
  },
  dmg(nodes, translate) {
    const { args: [number], override } = parse(nodes);
    const text = override || translate('stat-dmg', number || '1');
    return `${number ? `${number} ` : ''}${getText(text, 'JUSTICE')}`;
  },
  card(nodes, translate) {
    const {
      args: [idCard, quantity = '1'],
      override,
      empty,
    } = parse(nodes);
    if (empty) return '';
    const text = override || translate(`card-name-${idCard}`, quantity);
    return getText(text, 'PATIENCE', { card: idCard });
  },
  mode(nodes, translate) {
    const { args, empty } = parse(nodes);
    if (empty) return '';
    return translate(getKey('game-type', args[0]));
  },
  rarity(nodes, translate) {
    const { args: [label], override, empty } = parse(nodes);
    if (empty) return '';
    const text = override || translate(getKey('rarity', label));
    return getText(text, label);
  },
  division(nodes, translate) {
    const { args: [div, short = false], empty } = parse(nodes);
    if (empty) return '';
    const index = div.indexOf('_');
    const legend = index === -1;
    const rank = legend ? div : div.substring(0, index);
    const number = short || legend ? '' : ` ${div.substring(index + 1)}`;
    const label = translate(getKey('division', rank));
    return getText(`${short ? label.substring(0, 1) : label}${number}`, `${rank}_NEON`);
  },
  cosmetic(nodes, translate) {
    const { args: [text, name], empty } = parse(nodes);
    if (empty || !name) return '';
    return `${translate(getKey('reward', text))} - ${name}`;
  },
  style(nodes) {
    const { args: [styles, text] } = parse(nodes);
    return getText(text, styles);
  },
  switch_left(nodes) {
    return switchHandler(nodes, 'left');
  },
  switch_right(nodes) {
    return switchHandler(nodes, 'right');
  },
  stats(nodes) {
    const { args } = parse(nodes);
    return ['cost', 'attack', 'health']
      .slice(Math.max(0, 3 - nodes.length))
      .map((clazz, i) => args[i].replace(/\d+/, `<span class="${clazz}">$&</span>`))
      .join('/');
  },
};
