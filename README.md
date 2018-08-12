# AbbreviateCurrency

[![CircleCI](https://circleci.com/gh/shaungrady/abbreviate-currency.svg?style=svg)](https://circleci.com/gh/shaungrady/abbreviate-currency)
[![Maintainability](https://api.codeclimate.com/v1/badges/d97bd90ec32ff0b2b283/maintainability)](https://codeclimate.com/github/shaungrady/approximate-currency/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/d97bd90ec32ff0b2b283/test_coverage)](https://codeclimate.com/github/shaungrady/approximate-currency/test_coverage)

---

Abbreviate currency values in a configurable, locale-friendly way.

**Example Usage:**

```js
import { AbbreviateCurrency } from 'abbreviate-currency'

const americanEnglishUsd = new AbbreviateCurrency({ language: 'en-US' })
const frenchCanadianEuros = new AbbreviateCurrency({ language: 'fr-CA', currency: 'EUR' })
const value = 75300.55

americanEnglishUsd.transform(value) // -> '$75.3K'
frenchCanadianEuros.transform(value) // -> '75,3K €'
```

## Quick Start

### Install

``` bash
$ npm install abbreviate-currency
```

Or [download a release](https://github.com/shaungrady/abbreviate-currency/releases).

### Instantiation

Instances are immutable. Values shown below are the defaults.
Defaults can be overridden by modifying `AbbreviateCurrency.defaultConfig`.
Changes to the default config will not be inherited by any previous class instances, as they are immutable.

```js
new AbbreviateCurrency({
  language: window.navigator.language, // String; BCP 47 language tag. Defaults to browser's language, e.g., 'en-US'.
  currency: 'USD', // ISO 4217 currency code.
  useLowerCaseSymbols: false, // E.g., use 'K' or 'k' for thousands.
  digitGroups: [
    { symbol: 'K', digits: 4 }, // 1,000+ (4 digits or more.)
    { symbol: 'M', digits: 7 }, // 1,000,000+ (7 digits or more.)
    { symbol: 'B', digits: 10 }, // 1,000,000,000+ (10 digits or more.)
    { symbol: 'T', digits: 13 } // 1,000,000,000,000+ (13 digits or more.)
  ]
})
```

### Instance Methods

#### `transform(value)`

Takes a number or number-like string and abbreviates it.

**en-US/USD Abbrevations:**
```
                    0 => '$0'
                0.001 => '$0'
                0.005 => '$0.01'
                    1 => '$1'
                 9.01 => '$9.01'
                   10 => '$10'
                 10.5 => '$11'
                1,000 => '$1K'
                1,999 => '$1.9K'
               19,999 => '$19.9K'
              199,999 => '$199K'
  199,999,999,999,999 => '$199T'
1,999,999,999,999,999 => '$1,999T'
```



## A Quick Note

I have not done much testing with non-Western locales, nor with any non-Hindu–Arabic numeral systems. If you'd like to
help out, please make an issue or a PR.
