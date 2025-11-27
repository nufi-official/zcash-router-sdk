export type NewType<name extends string, base = string> = base & {
  [_ in `__NewType_${name}`]: undefined;
};

export const ensure = <T>(value: T | undefined): T => {
  if (value === undefined) {
    throw new Error('Value is undefined');
  }
  return value as T;
};
