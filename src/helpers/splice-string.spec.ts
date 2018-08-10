import { spliceString } from './splice-string'

const testString = '0123456789'

describe(`spliceString`, () => {
  test(`removes chars from index`, () => {
    expect(spliceString(testString, 4, 3))
      .toBe('0123789')
  })

  test(`adds chars to index`, () => {
    expect(spliceString(testString, 4, 0, '__'))
      .toBe('0123__456789')
  })

  test(`adds and removes chars at index`, () => {
    expect(spliceString(testString, 4, 2, '__'))
      .toBe('0123__6789')
  })
})
