/** Concatenate only string arguments as HTML classnames. */
export const cls = (...classNames: unknown[]) =>
	classNames.filter((n) => typeof n === "string").join(" ");

export const debounce = (callback: () => void, delay: number) => {
	let timer: number | undefined = undefined;

	return () => {
		clearTimeout(timer);
		timer = setTimeout(() => {
			callback();
		}, delay);
	};
};

// HACK: in a production environment, a library or Temporal polyfill would be
// used instead of these functions (esp for i18n).

const getMinutesPart = (sec: number) => Math.floor(sec / 60);
const getSecondsPart = (sec: number) => sec % 60;

/** Formats duration as `{min} min, {sec} sec` */
export function fmtDurationShort(sec: number) {
	const minFmt = String(getMinutesPart(sec));
	const secFmt = String(getSecondsPart(sec).toFixed(0));
	const humanDuration = `${minFmt} min ${secFmt} sec`;
	return humanDuration;
}

/** Formats duration as `{min}:{sec}` */
export function fmtDurationDigital(sec: number) {
	const minFmt = String(getMinutesPart(sec));
	const secFmt = String(getSecondsPart(sec).toFixed(0)).padStart(2, "0");
	const humanDuration = `${minFmt}:${secFmt}`;
	return humanDuration;
}
