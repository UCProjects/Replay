/**
 * Checks if object only has keys contained in "other" object.
 */
export default function containsOnly<T extends object>(
  object: object,
  other: T = {} as T,
  matchesEmpty = false,
): object is T {
  if (!Object.keys(other).length) return matchesEmpty;
  return Object.keys(object).every((key) => key in other);
}
