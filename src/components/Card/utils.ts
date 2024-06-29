import { Family } from '~/types/card';

export function getType(type: Family): string {
  switch (type) {
    case Family.UT: return '';
    case Family.DR: return '_DR';
    default: return `_${type}`;
  }
}
