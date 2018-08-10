module.exports = {
  testURL: 'http://localhost',
  roots: [
    `<rootDir>/src`
  ],
  transform: {
    '^.+\\.ts$': 'ts-jest'
  },
  testRegex: `(/__tests__/.*|(\\.|/)(test|spec))\\.ts$`,
  moduleFileExtensions: [
    'ts',
    'js',
    'json',
    'node'
  ],
  collectCoverage: true,
  coverageDirectory: '<rootDir>/coverage'
}
