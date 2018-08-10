export function indexOfLastDigit (formattedAmount: string): number {
  const chars = Array.from(formattedAmount)
  let index = chars.length
  /* tslint:disable-next-line:no-empty */
  while (index-- && /\d/.test(chars.pop() as string) === false) {}
  return index
}
