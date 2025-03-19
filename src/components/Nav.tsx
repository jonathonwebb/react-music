import { useEffect, useRef } from "react";
import { type Playlist, playlists } from "../lib/playlist";
import { cls } from "../lib/utils";

type NavProps = {
	onSelect: (p: Playlist) => void;
	selected: Playlist;
};

/** Playlist navigation tablist. */
export default function Nav({ onSelect, selected }: NavProps) {
	const tablistRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		// Handle up/down arrow interactions for the tablist.
		// See: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/tab_role#example
		const tablistEl = tablistRef.current;

		const onKeydown = (e: KeyboardEvent) => {
			if (e.key === "ArrowDown" || e.key === "ArrowUp") {
				const tabEls = tablistEl?.querySelectorAll<HTMLDivElement>(
					':scope > [role="tab"]',
				);
				if (!tabEls) return;

				let newIndex = 0;
				const currentIndex = playlists.indexOf(selected);

				if (e.key === "ArrowDown") {
					newIndex = (currentIndex + 1) % playlists.length; // on ArrowDown, select next tab
				} else {
					newIndex = (currentIndex - 1 + playlists.length) % playlists.length; // on ArrowUp, select previous tab
				}

				onSelect(playlists[newIndex]);
				tabEls[newIndex].focus();
			}
		};

		if (tablistEl) {
			tablistEl.addEventListener("keydown", onKeydown);
		}

		return () => {
			if (tablistEl) {
				tablistEl.removeEventListener("keydown", onKeydown);
			}
		};
	}, [selected, onSelect]);

	return (
		<section className="list">
			<h2 className="list__header">Playlists</h2>
			<div
				role="tablist"
				aria-label="Playlist tabs"
				aria-orientation="vertical"
				className="list__items"
				ref={tablistRef}
			>
				{playlists.map((p) => (
					<NavItem
						key={p.id}
						playlist={p}
						isSelected={selected?.id === p.id}
						onSelect={onSelect}
					/>
				))}
			</div>
		</section>
	);
}

type NavItemProps = {
	playlist: Playlist;
	isSelected: boolean;
	onSelect: (p: Playlist) => void;
};

/** Playlist navigation tab. */
function NavItem({ playlist, isSelected, onSelect }: NavItemProps) {
	return (
		<button
			id={`tab-${playlist.id}`}
			role="tab"
			key={playlist.id}
			aria-selected={isSelected}
			aria-controls={`panel-${playlist.id}`}
			className={cls(
				"list__item list__item--dynamic",
				isSelected && "list__item--selected",
			)}
			onClick={() => onSelect(playlist)}
			tabIndex={isSelected ? 0 : -1}
			type="button"
		>
			{playlist.name}
		</button>
	);
}
