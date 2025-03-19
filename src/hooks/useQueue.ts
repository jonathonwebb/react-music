import { useContext } from "react";
import { QueueContext } from "../contexts/queueContext";

/** Convenience hook for accessing QueueContext. */
export function useQueue() {
	const ctx = useContext(QueueContext);
	if (ctx === null) {
		throw new Error("useQueue must be used within a PlayerProvider");
	}
	return ctx;
}
