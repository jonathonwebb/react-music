import { useEffect, useState } from "react";
import useAudio from "../hooks/useAudio";
import { useQueue } from "../hooks/useQueue";
import { fmtDurationDigital } from "../lib/utils";
import {
	PauseIcon,
	PlayIcon,
	SkipBackIcon,
	SkipForwardIcon,
	VolumeMaximizedIcon,
	VolumeMutedIcon,
} from "./Icons";
import classes from "./controls.module.css";

/**
 * Playback controls (skip/play/pause buttons, seek controls, volume controls).
 */
export default function Controls() {
	return (
		<section className={classes.container}>
			<ControlButtons />
			<ControlSeek />
			<ControlVolume />
		</section>
	);
}

/**  Skip to prev/next, play/pause buttons. */
function ControlButtons() {
	const { state, dispatch } = useQueue();
	const track = state.queued.length ? state.queued[0] : null;

	const audio = useAudio();

	const isPaused = audio.state.paused;
	const hasTrack = track && !audio.state.error;
	const hasPrev = state.dequeued.length > 0;
	const hasNext = state.queued.length > 1;

	const skipPrev = () => {
		if (hasPrev) dispatch({ type: "queue-requeue-track" });
	};

	const skipNext = () => {
		if (hasNext) dispatch({ type: "queue-dequeue-track" });
	};

	return (
		<div className={classes.buttons}>
			<button
				aria-label="Skip to previous track"
				onClick={skipPrev}
				disabled={!hasPrev}
				className={classes.button}
				type="button"
			>
				<SkipBackIcon className={classes.buttonIcon} />
			</button>
			<button
				aria-label={isPaused ? "Resume playback" : "Pause playback"}
				onClick={() => (isPaused ? audio.play() : audio.pause())}
				disabled={!hasTrack}
				className={classes.button}
				type="button"
			>
				{isPaused ? (
					<PlayIcon className={classes.buttonIcon} />
				) : (
					<PauseIcon className={classes.buttonIcon} />
				)}
			</button>
			<button
				aria-label="Skip to next track"
				onClick={skipNext}
				disabled={!hasNext}
				className={classes.button}
				type="button"
			>
				<SkipForwardIcon className={classes.buttonIcon} />
			</button>
		</div>
	);
}

/** Playback seek controls. */
function ControlSeek() {
	const { state } = useQueue();
	const audio = useAudio();

	const track = state.queued.length ? state.queued[0] : null;
	const hasTrack = track !== null;
	const duration = track?.duration ?? 0;
	const currentTime = Math.min(audio.state.currentTime, duration);

	const onSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
		audio.seek(e.currentTarget.valueAsNumber);
	};

	return (
		<div className={classes.playback}>
			{audio.state.error ? (
				<div className={classes.warning}>A playback error occurred.</div>
			) : (
				<>
					<span className={classes.playbackDuration}>
						{fmtDurationDigital(currentTime)}
					</span>
					<label className="sr-only" htmlFor="seek-input">
						Seek to timestamp
					</label>
					<input
						id="seek-input"
						type="range"
						min={0}
						max={duration}
						disabled={!hasTrack}
						value={currentTime}
						onChange={onSeek}
						className={classes.playbackSlider}
					/>
					<span className={classes.playbackDuration}>
						{fmtDurationDigital(duration)}
					</span>
				</>
			)}
		</div>
	);
}

const VOLUME_MIN = 0; // 0%
const VOLUME_MAX = 1; // 100%
const VOLUME_STEP = 0.01; // 1%

/** Playback volume controls.*/
function ControlVolume() {
	const audio = useAudio();

	const [volume, setVolume] = useState(audio.state.volume);
	const muted = volume === 0;

	const onMute = () => {
		setVolume(VOLUME_MIN);
	};

	const onMaximize = () => {
		setVolume(VOLUME_MAX);
	};

	const onAdjust = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newVolume = e.currentTarget.valueAsNumber;
		setVolume(Math.max(0, Math.min(1, newVolume)));
	};

	useEffect(() => {
		audio.volume(volume);
	}, [audio.volume, volume]);

	return (
		<div className={classes.volume}>
			<label className="sr-only" htmlFor="mute-volume-button">
				Mute volume
			</label>
			<button
				id="mute-volume-button"
				className={classes.button}
				disabled={muted}
				onClick={onMute}
				type="button"
			>
				<VolumeMutedIcon className={classes.buttonIcon} />
			</button>
			<label className="sr-only" htmlFor="volume-input">
				Mute volume
			</label>
			<input
				id="volume-input"
				type="range"
				min={VOLUME_MIN}
				max={VOLUME_MAX}
				step={VOLUME_STEP}
				value={volume}
				onChange={onAdjust}
				className={classes.volumeSlider}
			/>
			<label className="sr-only" htmlFor="max-volume-button">
				Maximize volume
			</label>
			<button
				id="max-volume-button"
				className={classes.button}
				disabled={volume === 1}
				onClick={onMaximize}
				type="button"
			>
				<VolumeMaximizedIcon className={classes.buttonIcon} />
			</button>
		</div>
	);
}
