"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Command {
    constructor(name, info, config) {
        this.name = name;
        this.info = info;
        this.config = config;
    }
    async run(msg) {
    }
}
exports.default = Command;
