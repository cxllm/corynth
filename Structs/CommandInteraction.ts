import {
  APIMessage,
  InteractionReplyOptions,
  MessageAdditions,
  Structures,
  CommandInteraction
} from "discord.js-light";
import Corynth from "./Client";

export default class extends CommandInteraction {
  client: Corynth;
  db: any;
}

Structures.extend(
  "CommandInteraction",
  (C) =>
    class CommandInteraction extends C {
      client: Corynth;
      db: any;
    }
);
