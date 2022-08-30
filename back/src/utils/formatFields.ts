export const formatFields = <D extends object>(keys: (keyof D)[], dto: D) => {
  return keys.reduce<D>((acc, field) => {
    if (dto[field]) {
      acc[field] = dto[field];
    }
    return acc;
  }, {} as D);
};
