export function boolProp(value: boolean | undefined, fallback: boolean): boolean {
  if (value === undefined) {
    return fallback;
  }
  return value;
}
