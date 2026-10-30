export function randomInteger(minimum: number, maximum: number): number {
  return Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
}

export function randomBoolean(): boolean {
  return Math.random() < 0.5;
}

export function randomFloat(minimum: number, maximum: number, decimalPlaces = 1): number {
  const value = minimum + Math.random() * (maximum - minimum);
  return Number(value.toFixed(decimalPlaces));
}

export function randomItem<T>(items: T[]): T {
  if (items.length === 0) {
    throw new Error('Нельзя выбрать случайный элемент из пустого массива.');
  }

  return items[randomInteger(0, items.length - 1)];
}
