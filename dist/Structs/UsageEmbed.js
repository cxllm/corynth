"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("../config"));
const { emojis, colours: { error } } = config_1.default;
function default_1(command) {
    return {
        embed: {
            description: `${emojis.cross} Incorrect usage of ${command.name}`,
            fields: [
                {
                    name: "Command Description", value: command.info.description
                },
                {
                    name: "Command Usage", value: `${command.name} ${command.info.usage}`
                }
            ],
            footer: {
                text: "Usage: <> is required and [] is optional"
            },
            color: error
        }
    };
}
exports.default = default_1;
