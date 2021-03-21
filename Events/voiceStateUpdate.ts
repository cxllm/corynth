import Event from "../Structs/Event";
import Client from "../Structs/Client";
import { VoiceState } from "discord.js-light"
export = class extends Event {

    constructor(client: Client) {
        super(client, "voiceStateUpdate", "on");
    }
    async run(oldState: VoiceState, newState: VoiceState) {
        let guild = oldState?.guild
        if (!guild) guild = newState?.guild;
        if (!guild) return;
        if (!guild.me.voice.channel) {
            const queue = this.client.queue.get(guild.id)
            if (!queue) return;
            else {
                const embed = {
                    title: "Queue Cleared",
                    description: "I was disconnected from the voice channel so I cleared the queue.",
                    color: this.client.config.colours.main
                }
                queue.text.send({ embed });
                queue.songs = [];
                queue.timedout = true;
                queue.player.stopTrack();
                return this.client.queue.delete(guild.id);
            }
        }
        if (guild.me.voice.channel.members.size > 1) return;
        else {
            const queue = this.client.queue.get(guild.id)
            if (!queue) guild.me.voice.channel.leave();
            if (queue.player.paused) return;
            setTimeout(() => {
                const embed = {
                    title: "Queue Cleared",
                    description: "There was no one in this voice channel for 15s so I disconnected.",
                    color: this.client.config.colours.main
                }
                if (!guild.me.voice.channel || guild.me.voice.channel.members.size > 1) return;
                queue.text.send({ embed })
                queue.timedout = true;
                queue.songs = [];
                queue.player.stopTrack();
                this.client.queue.delete(guild.id);
            }, 15000)
        }
    }
}