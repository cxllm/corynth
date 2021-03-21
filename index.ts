import Client from "./Structs/Client";
require("./Structs/Message")
const client = new Client();
client.connect();
declare global {
    interface String {
        toProperCase(): string;
    }
}
String.prototype.toProperCase = function (): string {
    return this.replace(/\w\S*/g, function (text: string): string {
        return text.charAt(0).toUpperCase() + text.substr(1).toLowerCase();
    });
};
