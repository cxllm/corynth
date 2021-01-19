module.exports = class Event {
    /**
     * Create an event
     * @param {String} name The name of the event
     * @param {Object} data The details of the event
     */
    constructor(name, data) {
        this.name = name;
        this.prop = data.prop;
        this.method = data.method;
    }
}