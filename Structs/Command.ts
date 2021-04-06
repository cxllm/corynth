import { PermissionString } from "discord.js";
interface info {
    description: string;
    usage: string;
    aliases: string[];
    category?: string;
}
interface config {
    args: number;
    permissions: { user?: PermissionString; bot?: PermissionString };
    owner: boolean;
    cooldown?: string;
    filter?: boolean
}
import Message from "./Message";
export default class Command {
    name: string;
    info: info;
    config: config;
    constructor(name: string, info: info, config: config) {
        this.name = name;
        this.info = info;
        this.config = config;
    }
    async run(msg: Message): Promise<any> {
        return msg;
    }
}
export type { info, config };