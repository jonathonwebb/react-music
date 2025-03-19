import { useEffect, useSyncExternalStore } from "react";
import { debounce } from "../lib/utils";

// Abstracts access to an HTMLAudioElement via `useSyncExternalStore`.
// See: https://react.dev/reference/react/useSyncExternalStore

const VOLUME_KEY = "react-music-volume"; // Volume persistence key
const VOLUME_DEBOUNCE = 500; // Volume persistence debounce

// Load initial volume from browser storage:
let initialVolume = 0.5;
try {
	const localVolumeStr = localStorage.getItem(VOLUME_KEY);
	if (localVolumeStr !== null) initialVolume = Number(localVolumeStr);
} catch (err) {
	console.warn(err);
}

// Initialize HTMLAudio:
const audioEl: HTMLAudioElement = new Audio();
audioEl.autoplay = true;
audioEl.volume = initialVolume;

audioEl.addEventListener("volumechange", onVolumeChange);

/** Use a global HTMLAudioElement. */
export default function useAudio() {
	const audio = useSyncExternalStore(subscribe, getSnapshot);

	useEffect(() => {
		// If the current source changes, attempt to play it:
		if (audio.src !== "") audioEl.play().catch((err) => console.warn(err));
	}, [audio.src]);

	// Playback controls:
	const play = () => audioEl.play().catch((err) => console.warn(err));
	const pause = () => audioEl.pause();
	const stop = () => {
		try {
			audioEl.src = "";
			audioEl.removeAttribute("src");
		} catch (err) {
			console.warn(err);
		}
	};
	const load = (src: string) => {
		stop();
		audioEl.src = src;
	};
	const seek = (t: number) => {
		audioEl.currentTime = t;
	};
	const volume = (level: number) => {
		audioEl.volume = level;
	};

	return { state: audio, play, pause, stop, load, seek, volume };
}

// Default store snapshot:
let lastSnapshot = {
	src: audioEl.src,
	currentTime: audioEl.currentTime,
	paused: audioEl.paused,
	ended: audioEl.ended,
	volume: audioEl.volume,
	error: audioEl.error,
};

/** `useSyncExternalStore` snapshot getter. */
function getSnapshot() {
	// If a change to properties we care about has occurred, return a new object.
	// Otherwise, return a memoized value to indicate that no change occurred.
	if (
		audioEl.src !== lastSnapshot.src ||
		audioEl.currentTime !== lastSnapshot.currentTime ||
		audioEl.paused !== lastSnapshot.paused ||
		audioEl.ended !== lastSnapshot.ended ||
		audioEl.volume !== lastSnapshot.volume ||
		audioEl.error !== lastSnapshot.error
	) {
		lastSnapshot = {
			src: audioEl.src,
			currentTime: audioEl.currentTime,
			paused: audioEl.paused,
			ended: audioEl.ended,
			volume: audioEl.volume,
			error: audioEl.error,
		};
	}
	return lastSnapshot;
}

/** `useSyncExternalStore` subscriber. */
function subscribe(callback: () => void) {
	// Events that will trigger the snapshot getter:
	const events = [
		"loadstart",
		"canplaythrough",
		"timeupdate",
		"ended",
		"play",
		"pause",
		"volumechange",
		"error",
		"duration",
	];

	for (const event of events) {
		audioEl.addEventListener(event, callback);
	}

	return () => {
		for (const event of events) {
			audioEl.removeEventListener(event, callback);
		}
	};
}

/** Attempt to store current volume level. */
function storeLocalVolume() {
	try {
		localStorage.setItem(VOLUME_KEY, String(audioEl.volume));
	} catch (err) {
		console.warn(err);
	}
}

/** Schedule a debounced volume storage event. */
function onVolumeChange() {
	debounce(storeLocalVolume, VOLUME_DEBOUNCE)();
}
