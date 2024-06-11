import containsOnly from './containsOnly';

export default function getOptional<D extends object, T extends any[]>(
  args: T,
  defaults: D = {} as D,
): D {
  const lastArg: unknown = args.pop();
  if (lastArg) {
    if (typeof lastArg === 'object' && containsOnly(lastArg, defaults, true)) {
      return {
        ...defaults,
        ...lastArg,
      };
    }
    args.push(lastArg);
  }
  return defaults;
}
