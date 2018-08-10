// Based on https://stackoverflow.com/a/21350614
export function spliceString (str: string, index: number, count: number, add?: string) {
  return str.slice(0, index) + (add || '') + str.slice(index + count)
}
