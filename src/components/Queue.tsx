import useAudio from "../hooks/useAudio";
import { useQueue } from "../hooks/useQueue";
import type { Track } from "../lib/track";
import { cls, fmtDurationDigital } from "../lib/utils";
import classes from "./queue.module.css";

/** Playback queue. */
export default function Queue() {
	const {
		state: { queued, dequeued },
	} = useQueue();

	const queueEmpty = !queued.length && !dequeued.length;

	return (
		<section className="list">
			<h2 className="list__header">Now Playing</h2>
			<ul className="list__items">
				{queueEmpty ? (
					<li className="list__item">Queue is empty.</li>
				) : (
					<>
						{dequeued.map((track) => (
							<QueueItem
								key={track.id}
								track={track}
								isPlaying={false}
								donePlaying
							/>
						))}
						{queued.map((track, index) => (
							<QueueItem key={track.id} track={track} isPlaying={index === 0} />
						))}
					</>
				)}
			</ul>
		</section>
	);
}

type QueueItemProps = {
	track: Track;
	isPlaying: boolean;
	donePlaying?: boolean;
};

/** Playback queue item. */
function QueueItem({ track, isPlaying, donePlaying }: QueueItemProps) {
	const audio = useAudio();

	const duration = track.duration;
	const currentTime = Math.min(audio.state.currentTime, duration);

	return (
		<li
			className={cls(
				"list__item list__item--dynamic",
				isPlaying && "list__item--selected",
				donePlaying && classes.itemDone,
			)}
		>
			<span className="list__item-text">{track.name}</span>
			{isPlaying && (
				<span className={cls("list__item-static", classes.itemDuration)}>
					{fmtDurationDigital(currentTime)}/{fmtDurationDigital(duration)}
				</span>
			)}
		</li>
	);
}
