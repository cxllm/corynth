import Client from "./Structs/Client";
//Initialise custom modifications
require("./Structs/Message")
const client = new Client();
//Connect to discord
client.connect();
//Declare the toProperCase method globally
declare global {
    interface String {
        toProperCase(): string;
    }
}
//The actual toProperCase method
String.prototype.toProperCase = function (): string {
    return this.replace(/\w\S*/g, function (text: string): string {
        return text.charAt(0).toUpperCase() + text.substr(1).toLowerCase();
    });
};
