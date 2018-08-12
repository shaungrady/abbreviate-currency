"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function spliceString(str, index, count, add) {
    return str.slice(0, index) + (add || '') + str.slice(index + count);
}
exports.spliceString = spliceString;
