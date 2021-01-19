module.exports = class Command {
    /**
     * @param {String} name Command name
     * @param {Object} data Command data
     */
    constructor(name, data) {
        this.name = name, this.help = data.help, this.config = data.config;
    }
}