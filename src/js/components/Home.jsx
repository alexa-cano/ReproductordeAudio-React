import React, { useEffect, useState, useRef } from "react";
import { Player } from "./Player";

const Home = () => {
	const [songs, setSongs] = useState([]);
	const [isPlaying, setIsPlaying] = useState(false);
	const [currentSong, setCurrentSong] = useState();
	const [loop, setLoop] = useState(false);
	const [shuffle, setShuffle] = useState(false);
	const audioElem = useRef();

	useEffect(() => {
		getSongs();
	}, []);

	useEffect(() => {
		isPlaying ? audioElem.current.play() : audioElem.current.pause();
	}, [isPlaying]);

	const getSongs = async () => {
		try {
			const resp = await fetch("https://playground.4geeks.com/sound/songs");
			const data = await resp.json();
			setSongs(data.songs); // Aquí accedemos a la propiedad "songs"
		} catch (error) {
			console.error("Error fetching songs: ", error);
		}
	};

	const onPlaying = () => {
		const duration = audioElem.current.duration;
		const current = audioElem.current.currentTime;
		setCurrentSong((prev) => ({
			...prev,
			progress: (current / duration) * 100,
			length: duration,
			current: current,
		}));
	};

	const getSongIndex = () => {
		return songs.findIndex((el) => el.id === currentSong?.id);
	};

	const next = () => {
		if (shuffle) {
			random();
		} else {
			const index = getSongIndex();
			if (index === songs.length - 1) {
				setCurrentSong(songs[0]);
			} else {
				setCurrentSong(songs[index + 1]);
			}
		}
		setIsPlaying(true);
	};

	const prev = () => {
		const index = getSongIndex();
		if (index === 0) {
			setCurrentSong(songs[songs.length - 1]);
		} else {
			setCurrentSong(songs[index - 1]);
		}
		setIsPlaying(true);
	};

	const handleSelectedSong = (i) => {
		setCurrentSong(songs[i]);
		setIsPlaying(true);
	};

	const random = () => {
		const randomIndex = Math.floor(Math.random() * songs.length);
		setCurrentSong(songs[randomIndex]);
		setIsPlaying(true);
	};

	return (
		<div className="App bg-dark overflow-hidden">
			<div className="d-flex align-items-center row">
				<div className="container overflow-y-auto playlist mr-3 col-sm-12 col-md-2 col-lg-2">
					<ul className="list-group">
						{songs.map((el, i) => (
							<li
								className={`list-group-item item text-white border border-primary-subtle rounded-0 ${
									el.name === currentSong?.name ? "active" : ""
								}`}
								key={i}
								onClick={() => handleSelectedSong(i)}
							>
								{el.name}
							</li>
						))}
					</ul>
				</div>
				<div className="container col-sm-12 col-md-8 col-lg-8">
					<audio
						hidden
						src={
							currentSong &&
							`https://playground.4geeks.com${currentSong.url}`
						}
						ref={audioElem}
						onTimeUpdate={onPlaying}
						onEnded={next}
						loop={loop}
						autoPlay
					/>

					<Player
						songs={songs}
						setSongs={setSongs}
						isPlaying={isPlaying}
						setIsPlaying={setIsPlaying}
						audioElem={audioElem}
						currentSong={currentSong}
						loop={loop}
						setLoop={setLoop}
						next={next}
						prev={prev}
						random={random}
						setShuffle={setShuffle}
						shuffle={shuffle}
					/>
				</div>
			</div>
		</div>
	);
};

export default Home;
