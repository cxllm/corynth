import chalk from "chalk";
import moment from "moment";
export default class Logger {
  constructor() {}
  log(...text: string[]) {
    console.log(
      `${chalk.bold.gray(
        moment(Date.now()).format("dddd, Do MMMM YYYY, HH:mm:ss")
      )} [${chalk.bold.hex("89f7fc")("Log")}] ${text}`
    );
  }
  error(...text: string[]) {
    console.log(
      `${chalk.bold.gray(
        moment(Date.now()).format("dddd, Do MMMM YYYY, HH:mm:ss")
      )} [${chalk.bold.red("Error")}] ${text}`
    );
  }
  warn(...text: string[]) {
    console.log(
      `${chalk.bold.gray(
        moment(Date.now()).format("dddd, Do MMMM YYYY, HH:mm:ss")
      )} [${chalk.bold.hex("#ff8033")("Warning")}] ${text}`
    );
  }
  connection(...text: string[]) {
    console.log(
      `${chalk.bold.gray(
        moment(Date.now()).format("dddd, Do MMMM YYYY, HH:mm:ss")
      )} [${chalk.bold.hex("#00c1ff")("Connection")}] ${text}`
    );
  }
  debug(...text: string[]) {
    console.log(
      `${chalk.bold.gray(
        moment(Date.now()).format("dddd, Do MMMM YYYY, HH:mm:ss")
      )} [${chalk.bold.gray("Debug")}] ${text}`
    );
  }
}
