import { useQueue } from "../hooks/useQueue";
import { type Playlist, playlists } from "../lib/playlist";
import type { Track } from "../lib/track";
import { cls, fmtDurationDigital, fmtDurationShort } from "../lib/utils";
import { PlayIcon, ShuffleIcon } from "./Icons";
import classes from "./tracks.module.css";

type TracksProps = {
	playlist: Playlist;
};

/** Selected playlist tab panels. */
export default function Tracks({ playlist: selectedPlaylist }: TracksProps) {
	return (
		<>
			{playlists.map((playlist) => (
				<section
					key={playlist.id}
					id={`panel-${playlist.id}`}
					role="tabpanel"
					aria-labelledby={`tab-${playlist.id}`}
					hidden={playlist.id !== selectedPlaylist?.id}
				>
					<TracksHeader playlist={playlist} />
					<TracksControls playlist={playlist} />
					<TracksList playlist={playlist} />
				</section>
			))}
		</>
	);
}

type TracksHeaderProps = { playlist: Playlist };

/** Playlist details header. */
function TracksHeader({ playlist }: TracksHeaderProps) {
	return (
		<header className={classes.header}>
			<h1 className={classes.title}>{playlist.name}</h1>
			<p className={classes.summary}>
				<span className={classes.detail}>{playlist.artist}</span>
				<span className={`${classes.detail} ${classes.detailSubtle}`}>
					&bull;
				</span>
				<span className={`${classes.detail} ${classes.detailSubtle}`}>
					<span>{playlist.tracks.length} songs,</span>
					<span> </span>
					<span>{fmtDurationShort(playlist.totalDuration)}</span>
				</span>
			</p>
		</header>
	);
}

type TracksControlsProps = { playlist: Playlist };

/** Playlist controls (play all, shuffle all). */
function TracksControls({ playlist }: TracksControlsProps) {
	const { dispatch } = useQueue();

	const enqueuePlaylist = (
		playlist: Playlist,
		opts?: { shuffle?: boolean },
	) => {
		dispatch({
			type: opts?.shuffle ? "queue-shuffle-playlist" : "queue-set-playlist",
			payload: playlist,
		});
	};

	return (
		<div className={classes.controls}>
			<button
				className={classes.button}
				onClick={() => enqueuePlaylist(playlist)}
				type="button"
			>
				<PlayIcon className={classes.buttonIcon} />
				<span>Play all</span>
			</button>
			<button
				className={classes.button}
				onClick={() => enqueuePlaylist(playlist, { shuffle: true })}
				type="button"
			>
				<ShuffleIcon className={classes.buttonIcon} />
				<span>Shuffle all</span>
			</button>
		</div>
	);
}

type TracksListProps = { playlist: Playlist };

/** Playlist track list. */
function TracksList({ playlist }: TracksListProps) {
	return (
		<div className="list">
			<h2 className="list__header">Songs</h2>
			<div className="list__items songs__tracks">
				{playlist.tracks.map((track) => (
					<TrackItem key={track.id} track={track} />
				))}
			</div>
		</div>
	);
}

type TrackItemProps = {
	track: Track;
};

/** Playlist track list item. */
function TrackItem({ track }: TrackItemProps) {
	const {
		state: { queued: queue },
		dispatch,
	} = useQueue();

	const isPlaying = queue.length ? queue[0].id === track.id : false;

	const enqueueTrack = () => {
		dispatch({ type: "queue-set-track", payload: track });
	};

	return (
		<button
			onClick={enqueueTrack}
			className={cls(
				"list__item list__item--dynamic",
				isPlaying && "list__item--selected",
			)}
			type="button"
		>
			<span className={cls("list__item-text", classes.trackLeft)}>
				<PlayIcon className={classes.buttonIcon} />
				<span>{track.name}</span>
			</span>
			<span className={cls("list__item-static", classes.trackRight)}>
				{fmtDurationDigital(track.duration)}
			</span>
		</button>
	);
}
