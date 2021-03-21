"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const moment_1 = __importDefault(require("moment"));
class Logger {
    constructor() { }
    log(...text) {
        console.log(`${chalk_1.default.bold.gray(moment_1.default(Date.now()).format("dddd, Do MMMM YYYY, HH:mm:ss"))} [${chalk_1.default.bold.hex("89f7fc")("Log")}] ${text}`);
    }
    error(...text) {
        console.log(`${chalk_1.default.bold.gray(moment_1.default(Date.now()).format("dddd, Do MMMM YYYY, HH:mm:ss"))} [${chalk_1.default.bold.red("Error")}] ${text}`);
    }
    warn(...text) {
        console.log(`${chalk_1.default.bold.gray(moment_1.default(Date.now()).format("dddd, Do MMMM YYYY, HH:mm:ss"))} [${chalk_1.default.bold.hex("#ff8033")("Warning")}] ${text}`);
    }
    connection(...text) {
        console.log(`${chalk_1.default.bold.gray(moment_1.default(Date.now()).format("dddd, Do MMMM YYYY, HH:mm:ss"))} [${chalk_1.default.bold.hex("#00c1ff")("Connection")}] ${text}`);
    }
    debug(...text) {
        console.log(`${chalk_1.default.bold.gray(moment_1.default(Date.now()).format("dddd, Do MMMM YYYY, HH:mm:ss"))} [${chalk_1.default.bold.gray("Debug")}] ${text}`);
    }
}
exports.default = Logger;
