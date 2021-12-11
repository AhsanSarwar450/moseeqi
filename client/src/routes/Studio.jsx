import { Flex, useDisclosure } from '@chakra-ui/react';
import { useState, useEffect, useRef, Fragment } from 'react';
import Splitter, { SplitDirection } from '@devbookhq/splitter';
import * as Tone from 'tone';

import { PlayBackController } from '@Components/studio/PlaybackController';
import { PianoRoll } from '@Components/studio/PianoRoll';
import { TracksView } from '@Components/studio/TracksView';
import { PropertiesPanel } from '@Components/studio/PropertiesPanel';
import { WaitingModal } from '@Components/WaitingModal';
import { Instruments, MusicNotes } from '@Instruments/Instruments';

export const Studio = () => {
	//const [ numCols, setNumCols ] = useState(40);
	const [ playbackState, setPlaybackState ] = useState(0);
	const [ prePlaybackState, setPrevPlaybackState ] = useState(0);
	const [ seek, setSeek ] = useState(0);
	const [ activeWidth, setActiveWidth ] = useState(5 * 40);
	const [ isInstrumentLoading, setIsInstrumentLoading ] = useState(0);
	const seekInterval = useRef(null);
	const [ tracks, setTracks ] = useState(() => {
		setIsInstrumentLoading(1);
		const initialState = [
			{
				name: Instruments[0].name,
				instrument: Instruments[0],
				notes: [],
				sampler: new Tone.Sampler({
					urls: Instruments[0].urls,
					release: Instruments[0].release,
					attack: Instruments[0].attack,
					onload: () => {
						setIsInstrumentLoading(0);
					}
				}).toDestination()
			}
		];
		return initialState;
	});
	const [ bpm, setBPM ] = useState(120);
	const [ selectedIndex, setSelectedIndex ] = useState(0);
	const parts = useRef([
		new Tone.Part((time, value) => {
			tracks.at(-1).sampler.triggerAttackRelease(value.note, value.duration, time, value.velocity);
		}, [])
	]);
	const [ isContextStarted, setIsContextStarted ] = useState(false);

	const { isOpen, onOpen, onClose } = useDisclosure();

	const StartAudioContext = async () => {
		await Tone.start();
		setIsContextStarted(true);
	};

	useEffect(
		() => {
			if (isInstrumentLoading > 0) {
				onOpen();
			} else {
				onClose();
			}
		},
		[ isInstrumentLoading ]
	);

	useEffect(
		() => {
			if (!isContextStarted) StartAudioContext();
			else {
				if (playbackState === 1) {
					//

					for (let index = 0; index < tracks.length; index++) {
						// const activeCells = activeWidth / 5;
						// parts.current.push(
						// 	new Tone.Part(
						// 		(time, value) => {
						// 			tracks[index].sampler.triggerAttackRelease(
						// 				value.note,
						// 				value.duration,
						// 				time,
						// 				value.velocity
						// 			);
						// 		},
						// 		tracks[index].notes.filter((value) => value.time <= activeCells).map((value) => ({
						// 			time: value.time * 0.25,
						// 			note: value.note,
						// 			duration:
						// 				value.time + 8 / value.duration < activeCells
						// 					? `${value.duration}n`
						// 					: `${8 / (activeCells - value.time)}n`,
						// 			velocity: value.velocity
						// 		}))
						// 	)
						// );

						parts.current[index].start();
					}
					Tone.Transport.start();
					const id = setInterval(() => {
						setSeek(Tone.Transport.seconds * 4);
					}, 66);
					seekInterval.current = id;
				} else if (playbackState === 0) {
					// Stop
					for (let index = 0; index < parts.current.length; index++) {
						parts.current[index].stop();
					}
					Tone.Transport.stop();
					clearInterval(seekInterval.current);
				} else if (playbackState === 2) {
					//Pause
					Tone.Transport.pause();
					clearInterval(seekInterval.current);
				}
			}
			setPrevPlaybackState(playbackState);
		},
		[ playbackState, isContextStarted ]
	);

	// useEffect(
	// 	() => {
	// 		console.log(Tone.Transport.position, playbackPosition / 4);
	// 		//console.log('transport position new ', Tone.Transport.seconds);
	// 	},
	// 	[ playbackPosition ]
	// );

	useEffect(() => {
		//AddTrack(0);
		window.addEventListener('keydown', HandleKeyboardEvent);
		return () => {
			window.removeEventListener('keydown', HandleKeyboardEvent);
		};
	}, []);

	const SetRelease = (value) => {
		tracks[selectedIndex].sampler.release = value;
	};

	const SetAttack = (value) => {
		tracks[selectedIndex].sampler.attack = value;
	};

	const AddTrack = (instrument) => {
		let copy = [ ...tracks ];
		setIsInstrumentLoading(1);
		copy.push({
			name: Instruments[instrument].name,
			instrument: Instruments[instrument],
			notes: [],
			sampler: new Tone.Sampler({
				urls: Instruments[instrument].urls,
				release: Instruments[instrument].release,
				attack: Instruments[instrument].attack,
				onload: () => {
					//console.log(isInstrumentLoading);
					setIsInstrumentLoading(0);
				}
			}).toDestination()
		});
		setTracks(copy);
		parts.current.push(
			new Tone.Part((time, value) => {
				tracks.at(-1).sampler.triggerAttackRelease(value.note, value.duration, time, value.velocity);
			}, [])
		);
	};

	const AddNote = (column, row, divisor) => {
		let copy = [ ...tracks ];
		const note = {
			time: column,
			noteIndex: row,
			note: MusicNotes[row],
			duration: divisor,
			velocity: 1.0
		};
		copy[selectedIndex].notes.push(note);
		setTracks(copy);
		const partNote = {
			time: column * 0.25,
			note: MusicNotes[row],
			duration: `${divisor}n`,
			velocity: 1.0
		};
		console.log(parts.current);
		parts.current[selectedIndex].add(partNote);
	};

	// const SetNotes = (notes) => {
	// 	let copy = [ ...tracks ];
	// 	copy[selectedIndex].notes = notes;
	// 	setTracks(copy);
	// };

	const RemoveNote = (index) => {
		parts.current[selectedIndex].clear();
		let copy = [ ...tracks ];
		copy[selectedIndex].notes.splice(index, 1);
		setTracks(copy);
		copy[selectedIndex].notes.forEach((note) => {
			const partNote = {
				time: note.time * 0.25,
				note: note.note,
				duration: `${note.duration}n`,
				velocity: note.velocity
			};
			parts.current[selectedIndex].add(partNote);
		});
	};

	const ClearNotes = () => {
		parts.current[selectedIndex].clear();
		let copy = [ ...tracks ];
		copy[selectedIndex].notes = [];
		setTracks(copy);
	};

	const HandleKeyboardEvent = (event) => {
		if (event.keyCode === 32) {
			if (playbackState === 0) setPlaybackState(1);
			if (playbackState === 2) setPlaybackState(1);
			else if (playbackState === 1) setPlaybackState(2);
		}
	};

	return (
		<Fragment>
			<Flex
				onKeyPress={HandleKeyboardEvent}
				height="100vh"
				width="full"
				spacing={0}
				overflow="hidden"
				flexDirection="column"
			>
				<Flex width="100%" height="100%" flexDirection="row" overflow="hidden">
					<Splitter initialSizes={[ 20, 80 ]}>
						<PropertiesPanel
							numTracks={tracks.length}
							selectedIndex={selectedIndex}
							release={tracks[selectedIndex].sampler.release}
							attack={tracks[selectedIndex].sampler.attack}
							setRelease={SetRelease}
							setAttack={SetAttack}
						/>

						<Flex height="100%" spacing={0} overflow="hidden" flexDirection="column" flexGrow="3">
							<Splitter direction={SplitDirection.Vertical}>
								<TracksView
									playbackState={playbackState}
									tracks={tracks}
									onAddTrack={AddTrack}
									selected={selectedIndex}
									setSelected={setSelectedIndex}
									activeWidth={activeWidth}
									setActiveWidth={setActiveWidth}
									seek={seek}
									setSeek={setSeek}
								/>
								<PianoRoll
									track={tracks[selectedIndex]}
									addNote={AddNote}
									removeNote={RemoveNote}
									clearNotes={ClearNotes}
								/>
							</Splitter>
						</Flex>
					</Splitter>
				</Flex>
				<PlayBackController playbackState={playbackState} setPlaybackState={setPlaybackState} setBPM={setBPM} />
			</Flex>
			<WaitingModal onClose={onClose} isOpen={isOpen} />
		</Fragment>
	);
};
