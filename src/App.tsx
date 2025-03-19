import { useState } from "react";
import Controls from "./components/Controls";
import Nav from "./components/Nav";
import Queue from "./components/Queue";
import Tracks from "./components/Tracks";
import { QueueProvider } from "./contexts/QueueProvider";
import { type Playlist, playlists } from "./lib/playlist";

function App() {
	const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist>(
		playlists[0],
	);

	return (
		<QueueProvider>
			<div className="content">
				<div className="nav">
					<Nav onSelect={setSelectedPlaylist} selected={selectedPlaylist} />
				</div>
				<div className="tracks">
					<Tracks playlist={selectedPlaylist} />
				</div>
				<div className="queue">
					<Queue />
				</div>
			</div>
			<div className="footer">
				<Controls />
			</div>
		</QueueProvider>
	);
}

export default App;
