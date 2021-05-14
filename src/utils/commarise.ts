/**
 * Map the value of a number to its named value
 *
 * @param number
 * @param min
 */
export const commarise = (number: number, min: number = 1e3): string => {
  if (number >= min) {
    const units = ['k', 'M', 'B', 'T'];

    const order = Math.floor(Math.log(number) / Math.log(1000));

    const unitname = units[order - 1];
    const num = Number((number / 1000 ** order).toFixed(2));

    return num + unitname;
  }

  return number.toLocaleString();
};
