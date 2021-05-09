import { ShoukakuTrack } from "shoukaku";

export default class Track extends ShoukakuTrack {
  info: {
    identifier?: string;
    isSeekable?: boolean;
    author?: string;
    length?: number;
    isStream?: boolean;
    position?: number;
    title?: string;
    uri?: string;
    duration?: string;
  };
  skipped?: boolean;
  constructor() {
    super();
  }
}
