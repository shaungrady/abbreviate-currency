"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function indexOfLastDigit(formattedAmount) {
    var chars = Array.from(formattedAmount);
    var index = chars.length;
    while (index-- && /\d/.test(chars.pop()) === false) { }
    return index;
}
exports.indexOfLastDigit = indexOfLastDigit;
