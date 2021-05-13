/**
 * Slugify the string provided
 *
 * @param str
 */
export const slugify = (str: string): string =>
  str.toLowerCase().replace(/\s+/, '-');
