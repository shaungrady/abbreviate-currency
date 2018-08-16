/*! Written with love by Shaun Grady — https://shaungrady.com */

import { indexOfLastDigit } from './helpers/index-of-last-digit'
import { spliceString } from './helpers/splice-string'

interface Config {
  language?: string
  currency?: string
  useLowerCaseSymbols?: boolean
  digitGroups?: DigitGroup[]
}

interface DigitGroup {
  digits: number
  symbol: string
}

interface ProcessedDigitGroup {
  floor: number
  ceiling: number
  symbol: string
}

export class AbbreviateCurrency {
  // Defaults that can be altered by constructor config
  static defaultConfig: Config = {
    language: window.navigator.language,
    currency: 'USD',
    useLowerCaseSymbols: false,
    digitGroups: [
      { symbol: 'K', digits: 4 },
      { symbol: 'M', digits: 7 },
      { symbol: 'B', digits: 10 },
      { symbol: 'T', digits: 13 }
    ]
  }

  //
  readonly language!: string
  readonly currency!: string
  readonly useLowerCaseSymbols!: boolean
  readonly digitGroups!: DigitGroup[]

  // Determined in constructor
  private readonly processedDigitGroups: ProcessedDigitGroup[]
  private readonly radixSymbol: string = '.' // Default

  // Make this configurable at some point, maybe?
  private readonly fractionalDisplayLimit: number = 10

  constructor (config?: Config) {
    Object.assign(this, AbbreviateCurrency.defaultConfig, config)

    this.processedDigitGroups = this.processDigitGroups()

    // Determine radix symbol
    const match = this.format(1.2).match(/1(.)2/) // Assumes radixSymbol is one character
    if (match) this.radixSymbol = match[1]

    Object.freeze(this)
  }

  transform (value: number | string): string {
    const amount = this.normalize(value)
    const absAmount = Math.abs(amount)
    const groups = this.processedDigitGroups
    let output = ''

    if (absAmount < this.fractionalDisplayLimit) {
      output = this.format(amount)
    } else if (absAmount < groups[0].floor) {
      output = this.format(amount, true, 0)
    } else {
      const group = groups.find(g => absAmount >= g.floor && absAmount < g.ceiling)!
      const divided = amount / group.floor
      const shortened = this.format(divided, false, divided < 100 ? 1 : 0)
      const lastDigitIndex = indexOfLastDigit(shortened)

      output = spliceString(shortened, lastDigitIndex + 1, 0, group.symbol)
    }

    return output
  }

  get config (): Config {
    return {
      language: this.language,
      currency: this.currency,
      useLowerCaseSymbols: this.useLowerCaseSymbols,
      digitGroups: this.digitGroups
        .slice()
        .map(group => Object.assign({}, group))
    }
  }

  private processDigitGroups (): ProcessedDigitGroup[] {
    return this.digitGroups
      .sort((a, b) => a.digits - b.digits)
      .map((group, i, arr) => {
        let { symbol, digits } = group
        const nextGroup = arr[i + 1]

        symbol = this.useLowerCaseSymbols
          ? symbol.toLocaleLowerCase()
          : symbol.toLocaleUpperCase()
        const floor = Math.pow(10, digits - 1)
        const ceiling = nextGroup ? Math.pow(10, nextGroup.digits - 1) : Infinity

        return { symbol, floor, ceiling }
      })
  }

  private normalize (value: number | string): number {
    const num = Number(value)
    if (isNaN(num)) throw Error(`Invalid AbbreviateCurrency 'transform' argument: '${value}'`)
    return num
  }

  private format (value: number, round = true, decimalPlaces = 2): string {
    const { language, currency, radixSymbol } = this

    if (!round) {
      const by = Math.pow(10, decimalPlaces)
      value = Math.floor(value * by) / by
    } else value = Number(value.toFixed(decimalPlaces))

    const formatted = value.toLocaleString(language, { style: 'currency', currency: currency })
    const fractionalPartWithRadix = radixSymbol + this.getFractionalPart(formatted)
    const chars = decimalPlaces ? decimalPlaces + 1 : 0
    const output = formatted.replace(fractionalPartWithRadix, fractionalPartWithRadix.substring(0, chars))

    return this.stripZeroedFractionalPart(output)
  }

  private stripZeroedFractionalPart (formattedValue: string): string {
    const { radixSymbol } = this
    const fractionalPart = this.getFractionalPart(formattedValue)

    const fractionalDigits = fractionalPart.match(/\d/g)!
    const fractionalZeroes = fractionalPart.match(/0/g) || []

    if (fractionalDigits.length === fractionalZeroes.length) {
      formattedValue = formattedValue.replace(radixSymbol + fractionalPart, '')
    }

    return formattedValue
  }

  private getFractionalPart (formattedValue: string): string {
    const { radixSymbol } = this
    const radixIndex = formattedValue.indexOf(radixSymbol)
    const lastDigitIndex = indexOfLastDigit(formattedValue)
    return formattedValue.substring(radixIndex + 1, lastDigitIndex + 1)
  }
}
