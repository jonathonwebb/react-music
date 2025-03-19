/** Playlist wrapper providing an id property: */
export class Track {
	readonly id: string;
	constructor(
		public readonly name: string,
		public readonly url: string,
		public readonly duration: number,
	) {
		this.id = `${name}-${url}-${duration.toString()}`;
	}
}
