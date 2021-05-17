/**
 * Format a number to a percentage
 *
 * @param value
 */
export const formatPercentage = (value: number | string): string => {
  value = Number(value);

  let formattedValue: number | string;
  formattedValue = Number.isInteger(value) ? value : value.toFixed(2);

  return `${formattedValue}%`;
};
