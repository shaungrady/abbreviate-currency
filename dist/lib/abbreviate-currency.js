"use strict";
/*! Written with love by Shaun Grady — https://shaungrady.com */
Object.defineProperty(exports, "__esModule", { value: true });
var index_of_last_digit_1 = require("./helpers/index-of-last-digit");
var splice_string_1 = require("./helpers/splice-string");
var AbbreviateCurrency = (function () {
    function AbbreviateCurrency(config) {
        this.radixSymbol = '.';
        this.fractionalDisplayLimit = 10;
        Object.assign(this, AbbreviateCurrency.defaultConfig, config);
        this.processedDigitGroups = this.processDigitGroups();
        var match = this.format(1.2).match(/1(.)2/);
        if (match)
            this.radixSymbol = match[1];
        Object.freeze(this);
    }
    AbbreviateCurrency.prototype.transform = function (value) {
        var amount = this.normalize(value);
        var absAmount = Math.abs(amount);
        var groups = this.processedDigitGroups;
        var output = '';
        if (absAmount < this.fractionalDisplayLimit) {
            output = this.format(amount);
        }
        else if (absAmount < groups[0].floor) {
            output = this.format(amount, true, 0);
        }
        else {
            var group = groups.find(function (g) { return absAmount >= g.floor && absAmount < g.ceiling; });
            var divided = amount / group.floor;
            var shortened = this.format(divided, false, divided < 100 ? 1 : 0);
            var lastDigitIndex = index_of_last_digit_1.indexOfLastDigit(shortened);
            output = splice_string_1.spliceString(shortened, lastDigitIndex + 1, 0, group.symbol);
        }
        return output;
    };
    AbbreviateCurrency.prototype.processDigitGroups = function () {
        var _this = this;
        return this.digitGroups
            .sort(function (a, b) { return a.digits - b.digits; })
            .map(function (group, i, arr) {
            var symbol = group.symbol, digits = group.digits;
            var nextGroup = arr[i + 1];
            symbol = _this.useLowerCaseSymbols
                ? symbol.toLocaleLowerCase()
                : symbol.toLocaleUpperCase();
            var floor = Math.pow(10, digits - 1);
            var ceiling = nextGroup ? Math.pow(10, nextGroup.digits - 1) : Infinity;
            return { symbol: symbol, floor: floor, ceiling: ceiling };
        });
    };
    AbbreviateCurrency.prototype.normalize = function (value) {
        var num = Number(value);
        if (isNaN(num))
            throw Error("Invalid AbbreviateCurrency 'transform' argument: '" + value + "'");
        return num;
    };
    AbbreviateCurrency.prototype.format = function (value, round, decimalPlaces) {
        if (round === void 0) { round = true; }
        if (decimalPlaces === void 0) { decimalPlaces = 2; }
        var _a = this, language = _a.language, currency = _a.currency, radixSymbol = _a.radixSymbol;
        if (!round) {
            var by = Math.pow(10, decimalPlaces);
            value = Math.floor(value * by) / by;
        }
        else
            value = Number(value.toFixed(decimalPlaces));
        var formatted = value.toLocaleString(language, { style: 'currency', currency: currency });
        var fractionalPartWithRadix = radixSymbol + this.getFractionalPart(formatted);
        var chars = decimalPlaces ? decimalPlaces + 1 : 0;
        var output = formatted.replace(fractionalPartWithRadix, fractionalPartWithRadix.substring(0, chars));
        return this.stripZeroedFractionalPart(output);
    };
    AbbreviateCurrency.prototype.stripZeroedFractionalPart = function (formattedValue) {
        var radixSymbol = this.radixSymbol;
        var fractionalPart = this.getFractionalPart(formattedValue);
        var fractionalDigits = fractionalPart.match(/\d/g);
        var fractionalZeroes = fractionalPart.match(/0/g) || [];
        if (fractionalDigits.length === fractionalZeroes.length) {
            formattedValue = formattedValue.replace(radixSymbol + fractionalPart, '');
        }
        return formattedValue;
    };
    AbbreviateCurrency.prototype.getFractionalPart = function (formattedValue) {
        var radixSymbol = this.radixSymbol;
        var radixIndex = formattedValue.indexOf(radixSymbol);
        var lastDigitIndex = index_of_last_digit_1.indexOfLastDigit(formattedValue);
        return formattedValue.substring(radixIndex + 1, lastDigitIndex + 1);
    };
    AbbreviateCurrency.defaultConfig = {
        language: window.navigator.language,
        currency: 'USD',
        useLowerCaseSymbols: false,
        digitGroups: [
            { symbol: 'K', digits: 4 },
            { symbol: 'M', digits: 7 },
            { symbol: 'B', digits: 10 },
            { symbol: 'T', digits: 13 }
        ]
    };
    return AbbreviateCurrency;
}());
exports.AbbreviateCurrency = AbbreviateCurrency;
