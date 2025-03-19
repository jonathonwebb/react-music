import data from "../data/playlists.json";
import { Track } from "./track";

/** Playlist wrapper providing an id property & convenience methods. */
export class Playlist {
	readonly id: string;
	constructor(
		public readonly name: string,
		public readonly artist: string,
		public readonly year: number,
		public readonly tracks: Track[],
	) {
		this.id = `${name}-${artist}-${year.toString()}`;
	}

	get totalDuration(): number {
		return this.tracks.reduce((total, track) => total + track.duration, 0);
	}
}

// Initialize global playlists:
export const playlists = data.playlists.map(
	({ name, artist, year, tracks }) =>
		new Playlist(
			name,
			artist,
			year,
			tracks.map(({ name, url, duration }) => new Track(name, url, duration)),
		),
);
