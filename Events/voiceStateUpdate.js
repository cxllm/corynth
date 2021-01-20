const Event = require("../Structs/Event")
const Client = require("../Structs/Client");
const { VoiceState } = require("discord.js-light");
module.exports = class extends Event {
    constructor() {
        super("voiceStateUpdate", {
            method: "on"
        })
    }
    /**
     * 
     * @param {Client} client 
     * @param {VoiceState} oldState 
     * @param {VoiceState} newState 
     */
    async run(client, oldState, newState) {
        let guild = oldState?.guild
        if (!guild) guild = newState.guild;
        if (!guild) return;
        if (!guild.me.voice.channel) {
            const queue = client.queue.get(guild.id)
            if (!queue) return;
            else {
                const embed = {
                    title: "Queue Cleared",
                    description: "I was disconnected from the voice channel so I disconnected.",
                    color: client.config.colours.main
                }
                queue.text.send({ embed });
                queue.songs = [];
                queue.player.stopTrack();
                client.queue.delete(guild.id);
            }
        }
        if (guild.me.voice.channel.members.size > 1) return;
        else {
            const queue = client.queue.get(guild.id)
            if (!queue) guild.me.voice.channel.leave();
            if (queue.player.paused) return;
            setTimeout(() => {
                const embed = {
                    title: "Queue Cleared",
                    description: "There was no one in this voice channel for 15s so I disconnected.",
                    color: client.config.colours.main
                }
                if (!guild.me.voice.channel || guild.me.voice.channel.members.size > 1) return;
                queue.text.send({ embed })
                queue.timedout = true;
                queue.songs = [];
                queue.player.stopTrack();
                client.queue.delete(guild.id);
            }, 15000)
        }
    }
}