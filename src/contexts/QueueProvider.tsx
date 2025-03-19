import { useEffect, useReducer } from "react";
import useAudio from "../hooks/useAudio";
import { QueueContext, type State, queueReducer } from "./queueContext";

const initialState: State = {
	queued: [],
	dequeued: [],
};

type QueueProviderProps = { children: React.ReactNode };

/** Playback queue context provider. */
export function QueueProvider({ children }: QueueProviderProps) {
	const [state, dispatch] = useReducer(queueReducer, initialState);

	const audio = useAudio();

	// biome-ignore lint/correctness/useExhaustiveDependencies:
	useEffect(() => {
		// When a change to the playback queue occurs, stop the currently playing
		// audio, and load the new head of the playback queue (if any).
		audio.stop();

		if (state.queued.length) audio.load(state.queued[0].url);
	}, [state.queued]);

	useEffect(() => {
		// When the current audio ends, dequeue the current head of the playback
		// queue.
		if (audio.state.ended && state.queued.length)
			dispatch({ type: "queue-dequeue-track" });
	}, [audio.state.ended, state.queued.length]);

	const value = { state: { ...state, audio }, dispatch };

	return (
		<QueueContext.Provider value={value}>{children}</QueueContext.Provider>
	);
}
