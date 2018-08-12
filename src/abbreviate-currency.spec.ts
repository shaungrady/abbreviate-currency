import { versions } from 'process'
import { AbbreviateCurrency } from './abbreviate-currency'

const [major] = versions.node.split('.')
const hasIcu = typeof (versions as any).icu === 'string'

if (major !== '10') throw Error(`Tests require node 10 (currently using v${versions.node})`)
if (!hasIcu) throw Error(`Tests must be run with 'full-icu' package installed`)

describe(`AbbreviateCurrency`, () => {
  it(`instantiates without arguments`, () => {
    expect(new AbbreviateCurrency()).toBeInstanceOf(AbbreviateCurrency)
  })

  it(`#transform parses number strings`, () => {
    const approx = new AbbreviateCurrency()
    expect(approx.transform('123')).toBe(('$123'))
  })

  it(`#transform throws an error for NaN numbers/strings`, () => {
    const approx = new AbbreviateCurrency()
    expect(() => { approx.transform('potato') })
      .toThrowError(`Invalid AbbreviateCurrency 'transform' argument: 'potato'`)

    expect(() => { approx.transform({} as any) })
      .toThrowError(`Invalid AbbreviateCurrency 'transform' argument: '[object Object]'`)
  })

  describe(`by default`, () => {
    let approx = new AbbreviateCurrency()

    it(`uses navigator.language as language`, () => {
      expect(approx.language).toBe(window.navigator.language)
    })

    it(`uses 'USD' as currency code`, () => {
      expect(approx.currency).toBe('USD')
    })

    it(`uses uppercase symbols`, () => {
      expect(approx.useLowerCaseSymbols).toBe(false)
    })

    it(`uses '.' as a radix symbol`, () => {
      const { radixSymbol } = approx as any
      expect(radixSymbol).toBe('.')
    })

    it(`uses English digit groups`, () => {
      expect(approx.digitGroups).toEqual([
        { symbol: 'K', digits: 4 },
        { symbol: 'M', digits: 7 },
        { symbol: 'B', digits: 10 },
        { symbol: 'T', digits: 13 }
      ])
    })

    describe(`transforms`, () => {
      const testCases: [number, string][] = [
        [0, '$0'],
        [0.001, '$0'],
        [0.005, '$0.01'],
        [1, '$1'],
        [9.01, '$9.01'],
        [10, '$10'],
        [10.5, '$11'],
        [1000, '$1K'],
        [1999, '$1.9K'],
        [19999, '$19.9K'],
        [199999, '$199K'],
        [199999999999999, '$199T'],
        [1999999999999999, '$1,999T']
      ]

      testCases.forEach(([input, output]) => {
        it(`${input} to '${output}'`, () => expect(approx.transform(input)).toBe(output))
      })
    })
  })

  describe(`configuration`, () => {
    describe(`language`, () => {
      describe(`fr-CA`, () => {
        const x = new AbbreviateCurrency({ language: 'fr-CA' })

        const testCases: [number, string][] = [
          [0, '0 $ US'],
          [0.001, '0 $ US'],
          [0.005, '0,01 $ US'],
          [1, '1 $ US'],
          [9.01, '9,01 $ US'],
          [10, '10 $ US'],
          [10.5, '11 $ US'],
          [1000, '1K $ US'],
          [1999, '1,9K $ US'],
          [19999, '19,9K $ US'],
          [199999, '199K $ US'],
          [199999999999999, '199T $ US'],
          [1999999999999999, '1 999T $ US']
        ]

        testCases.forEach(([input, output]) => {
          // Ensure spaces are changed to non-breaking spaces
          output = output.replace(' ', ' ')
          it(`${input} to '${output}'`, () => expect(x.transform(input)).toEqual(output))
        })
      })

      describe(`es-MX`, () => {
        const x = new AbbreviateCurrency({ language: 'es-MX' })

        const testCases: [number, string][] = [
          [0, 'USD 0'],
          [0.001, 'USD 0'],
          [0.005, 'USD 0.01'],
          [1, 'USD 1'],
          [9.01, 'USD 9.01'],
          [10, 'USD 10'],
          [10.5, 'USD 11'],
          [1000, 'USD 1K'],
          [1999, 'USD 1.9K'],
          [19999, 'USD 19.9K'],
          [199999, 'USD 199K'],
          [199999999999999, 'USD 199T'],
          [1999999999999999, 'USD 1,999T']
        ]

        testCases.forEach(([input, output]) => {
          // Ensure spaces are changed to non-breaking spaces
          output = output.replace(' ', ' ')
          it(`${input} to '${output}'`, () => expect(x.transform(input)).toEqual(output))
        })
      })

      describe(`de-DE`, () => {
        const x = new AbbreviateCurrency({ language: 'de-DE' })

        const testCases: [number, string][] = [
          [0, '0 $'],
          [0.001, '0 $'],
          [0.005, '0,01 $'],
          [1, '1 $'],
          [9.01, '9,01 $'],
          [10, '10 $'],
          [10.5, '11 $'],
          [1000, '1K $'],
          [1999, '1,9K $'],
          [19999, '19,9K $'],
          [199999, '199K $'],
          [199999999999999, '199T $'],
          [1999999999999999, '1.999T $']
        ]

        testCases.forEach(([input, output]) => {
          // Ensure spaces are changed to non-breaking spaces
          output = output.replace(' ', ' ')
          it(`${input} to '${output}'`, () => expect(x.transform(input)).toEqual(output))
        })
      })
    })

    describe(`currencyCode`, () => {
      describe(`CAD`, () => {
        const approx = new AbbreviateCurrency({ currency: 'CAD' })

        const testCases: [number, string][] = [
          [0, 'CA$0'],
          [0.001, 'CA$0'],
          [0.005, 'CA$0.01'],
          [1, 'CA$1'],
          [9.01, 'CA$9.01'],
          [10, 'CA$10'],
          [10.5, 'CA$11'],
          [1000, 'CA$1K'],
          [1999, 'CA$1.9K'],
          [19999, 'CA$19.9K'],
          [199999, 'CA$199K'],
          [199999999999999, 'CA$199T'],
          [1999999999999999, 'CA$1,999T']
        ]

        testCases.forEach(([input, output]) => {
          it(`${input} to '${output}'`, () => expect(approx.transform(input)).toBe(output))
        })
      })

      describe(`EUR`, () => {
        const approx = new AbbreviateCurrency({ currency: 'EUR' })

        const testCases: [number, string][] = [
          [0, '€0'],
          [0.001, '€0'],
          [0.005, '€0.01'],
          [1, '€1'],
          [9.01, '€9.01'],
          [10, '€10'],
          [10.5, '€11'],
          [1000, '€1K'],
          [1999, '€1.9K'],
          [19999, '€19.9K'],
          [199999, '€199K'],
          [199999999999999, '€199T'],
          [1999999999999999, '€1,999T']
        ]

        testCases.forEach(([input, output]) => {
          it(`${input} to '${output}'`, () => expect(approx.transform(input)).toBe(output))
        })
      })
    })

    describe(`useLowerCaseSymbols`, () => {
      it(`lowers K, M, B, and T`, () => {
        const approx = new AbbreviateCurrency({ useLowerCaseSymbols: true })
        expect(approx.transform(1000)).toBe('$1k')
        expect(approx.transform(1000000)).toBe('$1m')
        expect(approx.transform(1000000000)).toBe('$1b')
        expect(approx.transform(1000000000000)).toBe('$1t')
      })
    })

    describe(`digitGroups`, () => {
      it(`accepts custom symbols and digits`, () => {
        const approx = new AbbreviateCurrency({
          digitGroups: [
            { symbol: 'x', digits: 3 },
            { symbol: '🤘', digits: 5 }
          ]
        })

        expect(approx.transform(123)).toBe('$1.2X')
        expect(approx.transform(12300)).toBe('$1.2🤘')
      })
    })
  })
})
