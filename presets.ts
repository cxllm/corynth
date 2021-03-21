import config from "./config";
const emojis = config.emojis;
export = {
    nothing_playing: `${emojis.cross} There is nothing playing!`,
    not_queue_vc: `${emojis.cross} You aren't in the queue voice channel!`,
    invalid_role: `${emojis.cross} Invalid Role!`,
    invalid_user: `${emojis.cross} Invalid User!`,
    invalid_channel: `${emojis.cross} Invalid Channel!`,
    no_reason: `No reason provided`,
    less_than_500: `The text has to be less than 500 characters!`,
    no_text: `Please provide some text`,
    chars_inv: `Invalid/Unescaped characters used`,
    no_spotify: `This user is not listening to spotify!`,
    filters: `[filter] has been set to \`[number]\`! Please give it a few seconds to apply.`,
    utc: `All dates are using the UTC/GMT timezone`,
    edit_image: `${emojis.loading} Editing image...`,
    loading_image: `${emojis.loading} Loading image...`
}