"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Event {
    constructor(client, name, method) {
        this.client = client;
        this.name = name;
        this.method = method;
    }
    async run(...args) {
    }
}
exports.default = Event;
