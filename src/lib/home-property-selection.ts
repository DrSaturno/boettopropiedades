const HOME_PROPERTY_LIMIT = 8;

// Featured listings always stay visible; other slots rotate when the catalog grows.
export function selectHomeProperties<T extends { featured: boolean }>(
  properties: readonly T[],
  random: () => number = Math.random
): T[] {
  const featured = properties.filter((property) => property.featured);
  const others = properties.filter((property) => !property.featured);

  if (properties.length <= HOME_PROPERTY_LIMIT) return [...featured, ...others];

  for (let index = others.length - 1; index > 0; index--) {
    const swapIndex = Math.floor(random() * (index + 1));
    [others[index], others[swapIndex]] = [others[swapIndex], others[index]];
  }

  return [
    ...featured,
    ...others.slice(0, Math.max(0, HOME_PROPERTY_LIMIT - featured.length)),
  ];
}
