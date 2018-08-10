import { indexOfLastDigit } from './index-of-last-digit'

describe(`indexOfLastDigit`, () => {
  test(`returns index of last digit`, () => {
    expect(indexOfLastDigit('ab2de'))
      .toBe(2)
    expect(indexOfLastDigit('abcd0'))
      .toBe(4)
    expect(indexOfLastDigit('9bcde'))
      .toBe(0)
  })

  test(`returns -1 when string has no digits`, () => {
    expect(indexOfLastDigit('abcde'))
      .toBe(-1)
  })
})
