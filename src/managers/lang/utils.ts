import { Nodes, ParsedNodes } from './types';

export function parse(nodes: Nodes): ParsedNodes {
  const found = nodes.findIndex((node) => node.startsWith('override='));
  const override = found !== -1 && nodes.splice(found, 1)[0];
  return {
    args: nodes,
    override: override ? override.substring(override.indexOf('=') + 1) : '',
    empty: !nodes.length && !override,
  };
}

export function getKey(prefix: string, name: string): string {
  return `${prefix}-${name.toLowerCase().replace(/_/g, '-')}`;
}

export function getText(text: string, classes: string, data: Record<string, string> = {}): string {
  return `<span class="${classes}"${
    Object.keys(data).map((key) => ` data-${key}="${data[key]}"`).join('')
  }>${text}</span>`;
}

export function switchHandler(nodes: Nodes, direction: 'left' | 'right'): string {
  const { args: [temp, text = temp] } = parse(nodes);
  const opacity = Number.isNaN(Number(temp)) ? 1 : Number(temp);
  const classes = [`switch_${direction}`];
  if (opacity <= 0) {
    classes.push('invisible');
  }
  return getText(text, classes.join(' '));
}
