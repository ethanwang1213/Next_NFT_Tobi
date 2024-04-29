/**
 * Adds object if object is empty.
 * @param {object} obj The parameter of function.
 * @returns {boolean} The if obj is empty.
 */

export function isEmptyObject(obj: object): boolean {
  const len = Object.keys(obj).length;
  if (len) {
    return true;
  } else {
    return false;
  }
}

export const statusOfShowcase = {
  private: 0,
  public: 1,
  publicSchedule: 2,
};
