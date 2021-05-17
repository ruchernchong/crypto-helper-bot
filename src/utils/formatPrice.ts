/**
 * Format a value to a valid price
 *
 * @param value
 * @param decimalPlaces
 */
export const formatPrice = (value: number, decimalPlaces: number = 2): string =>
  `$${Number(value.toFixed(decimalPlaces))}`;
