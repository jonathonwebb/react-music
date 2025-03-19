import { createContext } from "react";
import type { Playlist } from "../lib/playlist";
import type { Track } from "../lib/track";

// Queue context abstracts playback management as a queue:
// - state.queued: tracks queued for playback.
// - state.dequeued: tracks that have already been played.

export type Action =
	| { type: "queue-set-playlist"; payload: Playlist }
	| { type: "queue-shuffle-playlist"; payload: Playlist }
	| { type: "queue-set-track"; payload: Track }
	| { type: "queue-dequeue-track" }
	| { type: "queue-requeue-track" };
export type Dispatch = (action: Action) => void;
export type State = {
	queued: Track[];
	dequeued: Track[];
};

export const QueueContext = createContext<{
	state: State;
	dispatch: Dispatch;
} | null>(null);

export function queueReducer(state: State, action: Action): State {
	switch (action.type) {
		case "queue-set-playlist": {
			const playlist = action.payload;

			return { ...state, queued: [...playlist.tracks], dequeued: [] };
		}
		case "queue-shuffle-playlist": {
			const playlist = action.payload;
			const shuffled = playlist.tracks
				.map((track) => ({
					track,
					sort: Math.random(),
				}))
				.sort((a, b) => a.sort - b.sort)
				.map(({ track }) => track);

			return { ...state, queued: [...shuffled], dequeued: [] };
		}
		case "queue-set-track": {
			const track = action.payload;

			return { ...state, queued: [track], dequeued: [] };
		}
		case "queue-dequeue-track": {
			const [popped, ...rest] = state.queued;

			return { ...state, queued: rest, dequeued: [...state.dequeued, popped] };
		}
		case "queue-requeue-track": {
			const popped = state.dequeued[state.dequeued.length - 1];
			const rest = state.dequeued.slice(0, state.dequeued.length - 1);

			return { ...state, queued: [popped, ...state.queued], dequeued: rest };
		}
	}
}
