import type { translate as translateFn } from '.';
import {
  Nodes,
  getKey,
  getText,
  parse,
  switchHandler,
} from './utils';

type TranslateType = typeof translateFn;
export type Plugin = (nodes: Nodes, translate: TranslateType) => string;
export const plugins: Record<string, Plugin> = {
  ucp([amt]: Nodes): string {
    return getText(amt, 'ucp');
  },
  tribe(nodes: Nodes, translate: TranslateType): string {
    const { args, override, empty } = parse(nodes);
    if (empty) return '';
    const text = override || translate(getKey('tribe', args[0]), args[1] || '1');
    return getText(text, 'underlined');
  },
  soul(nodes: Nodes, translate: TranslateType): string {
    const { args, override, empty } = parse(nodes);
    if (empty) return '';
    const text = override || translate(getKey('soul', args[0].replace(/_/g, '-')));
    return getText(text, args[0]);
  },
  kw(nodes: Nodes, translate: TranslateType): string {
    const { args, override, empty } = parse(nodes);
    if (empty) return '';
    const text = override || translate(getKey('kw', args[0]));
    return getText(text, 'underlined');
  },
  artifact(nodes: Nodes, translate: TranslateType): string {
    const { args: [id, desc = false], override, empty } = parse(nodes);
    if (empty) return '';
    const text = override || translate(getKey(`artifact${desc ? '' : '-name'}`, id));
    return getText(text, desc ? '' : 'underlined');
  },
  hp(nodes: Nodes, translate: TranslateType): string {
    const { args: [number], override } = parse(nodes);
    const text = override || translate('stat-hp', number || '1');
    return `${number ? `${number} ` : ''}${getText(text, 'green')}`;
  },
  atk(nodes: Nodes, translate: TranslateType): string {
    const { args: [number], override } = parse(nodes);
    const text = override || translate('stat-atk', number || '1');
    return `${number ? `${number} ` : ''}${getText(text, 'red')}`;
  },
  gold(nodes: Nodes, translate: TranslateType): string {
    const { args: [number], override } = parse(nodes);
    const text = override || translate('stat-gold', number || '1');
    return `${number ? `${number} ` : ''}${getText(text, 'yellow')}`;
  },
  cost(nodes: Nodes, translate: TranslateType): string {
    const { args: [number], override } = parse(nodes);
    const text = override || translate('stat-cost', number || '1');
    return `${number ? `${number} ` : ''}${getText(text, 'blue')}`;
  },
  kr(nodes: Nodes, translate: TranslateType): string {
    const { override } = parse(nodes);
    const text = override || translate('stat-kr');
    return getText(text, 'PERSEVERANCE');
  },
  dmg(nodes: Nodes, translate: TranslateType): string {
    const { args: [number], override } = parse(nodes);
    const text = override || translate('stat-dmg', number || '1');
    return `${number ? `${number} ` : ''}${getText(text, 'JUSTICE')}`;
  },
  card(nodes: Nodes, translate: TranslateType): string {
    const {
      args: [idCard, quantity = '1'],
      override,
      empty,
    } = parse(nodes);
    if (empty) return '';
    const text = override || translate(`card-name-${idCard}`, quantity);
    return getText(text, 'PATIENCE', { card: idCard });
  },
  mode(nodes: Nodes, translate: TranslateType): string {
    const { args, empty } = parse(nodes);
    if (empty) return '';
    return translate(getKey('game-type', args[0]));
  },
  rarity(nodes: Nodes, translate: TranslateType): string {
    const { args: [label], override, empty } = parse(nodes);
    if (empty) return '';
    const text = override || translate(getKey('rarity', label));
    return getText(text, label);
  },
  division(nodes: Nodes, translate: TranslateType): string {
    const { args: [div, short = false], empty } = parse(nodes);
    if (empty) return '';
    const index = div.indexOf('_');
    const legend = index === -1;
    const rank = legend ? div : div.substring(0, index);
    const number = short || legend ? '' : ` ${div.substring(index + 1)}`;
    const label = translate(getKey('division', rank));
    return getText(`${short ? label.substring(0, 1) : label}${number}`, `${rank}_NEON`);
  },
  cosmetic(nodes: Nodes, translate: TranslateType): string {
    const { args: [text, name], empty } = parse(nodes);
    if (empty || !name) return '';
    return `${translate(getKey('reward', text))} - ${name}`;
  },
  style(nodes: Nodes): string {
    const { args: [styles, text] } = parse(nodes);
    return getText(text, styles);
  },
  switch_left(nodes: Nodes): string {
    return switchHandler(nodes, 'left');
  },
  switch_right(nodes: Nodes): string {
    return switchHandler(nodes, 'right');
  },
  stats(nodes: Nodes): string {
    const { args } = parse(nodes);
    return ['cost', 'attack', 'health']
      .slice(Math.max(0, 3 - nodes.length))
      .map((clazz, i) => args[i].replace(/\d+/, `<span class="${clazz}">$&</span>`))
      .join('/');
  },
};
