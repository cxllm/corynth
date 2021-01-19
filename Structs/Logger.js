const chalk = require("chalk"), moment = require("moment");
module.exports = class Logger {
    constructor() { }
    log(...text) {
        console.log(`${chalk.bold.gray(moment(Date.now()).format("dddd, Do MMMM YYYY, HH:mm:ss"))} [${chalk.bold.hex("89f7fc")("Log")}] ${text}`)
    }
    error(...text) {
        console.log(`${chalk.bold.gray(moment(Date.now()).format("dddd, Do MMMM YYYY, HH:mm:ss"))} [${chalk.bold.red("Error")}] ${text}`)
    }
    warn(...text) {
        console.log(`${chalk.bold.gray(moment(Date.now()).format("dddd, Do MMMM YYYY, HH:mm:ss"))} [${chalk.bold.hex("#ff8033")("Warning")}] ${text}`)
    }
    connection(...text) {
        console.log(`${chalk.bold.gray(moment(Date.now()).format("dddd, Do MMMM YYYY, HH:mm:ss"))} [${chalk.bold.hex("#00c1ff")("Connection")}] ${text}`)
    }
    debug(...text) {
        console.log(`${chalk.bold.gray(moment(Date.now()).format("dddd, Do MMMM YYYY, HH:mm:ss"))} [${chalk.bold.gray("Debug")}] ${text}`)
    }
    plain(...text) {
        console.log(text)
    }
}