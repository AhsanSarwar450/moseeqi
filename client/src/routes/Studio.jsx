import { Flex } from '@chakra-ui/react';
import { useState, useEffect, useRef } from 'react';
import * as Tone from 'tone';

import { PlayBackController } from '@Components/studio/PlaybackController';
import { PianoRoll } from '@Components/studio/PianoRoll';
import { TracksView } from '@Components/studio/TracksView';
import { PropertiesPanel } from '@Components/studio/PropertiesPanel';

import { Instruments, MusicNotes } from '@Instruments/Instruments';

const numNotes = 4;

const testNotes = [
	{ time: 0, note: 'C3', duration: 4, noteIndex: 1, velocity: 1 },
	{ time: 1, note: 'C6', duration: 8, noteIndex: 2, velocity: 1 },
	{ time: 2, note: 'C4', duration: 2, noteIndex: 3, velocity: 1 },
	{ time: 3, note: 'E4', duration: 4, noteIndex: 4, velocity: 1 }
];

export const Studio = () => {
	const [ numCols, setNumCols ] = useState(numNotes * 8);
	const [ isPlaying, setIsPlaying ] = useState(false);
	const [ tracks, setTracks ] = useState(() => {
		const initialState = [
			{
				instrument: Instruments[0],
				notes: [],
				sampler: new Tone.Sampler({
					urls: Instruments[0].urls,
					release: 1
				}).toDestination()
			}
		];
		return initialState;
	});
	const [ bpm, setBPM ] = useState(120);
	const [ selectedIndex, setSelectedIndex ] = useState(0);
	const parts = useRef([]);
	const [ isContextStarted, setIsContextStarted ] = useState(false);

	const StartAudioContext = async () => {
		await Tone.start();
		setIsContextStarted(true);
	};

	useEffect(
		() => {
			if (!isContextStarted) StartAudioContext();
			else {
				if (isPlaying) {
					//
					parts.current = [];
					for (let index = 0; index < tracks.length; index++) {
						parts.current.push(
							new Tone.Part(
								(time, value) => {
									tracks[index].sampler.triggerAttackRelease(
										value.note,
										value.duration,
										time,
										value.velocity
									);
								},
								tracks[index].notes.map((value) => ({
									time: value.time * 0.25,
									note: value.note,
									duration: `${value.duration}n`,
									velocity: value.velocity
								}))
							)
						);

						parts.current[index].start();
					}
					Tone.Transport.start();
				} else {
					for (let index = 0; index < tracks.length; index++) {
						parts.current[index].stop();
					}
					Tone.Transport.stop();
				}
			}
		},
		[ isPlaying, isContextStarted ]
	);

	const ToggleIsPlaying = () => {
		setIsPlaying(!isPlaying);
	};

	const AddTrack = (instrument) => {
		let copy = [ ...tracks ];
		copy.push({
			instrument: Instruments[instrument],
			notes: [],
			sampler: new Tone.Sampler({
				urls: Instruments[instrument].urls,
				release: 1
			}).toDestination()
		});
		setTracks(copy);
	};

	const SetNotes = (notes) => {
		let copy = [ ...tracks ];
		copy[selectedIndex].notes = notes;
		setTracks(copy);
	};

	return (
		<Flex height="100vh" width="full" spacing={0} overflow="hidden" flexDirection="column">
			<Flex width="100%" height="100%" flexDirection="row" overflow="hidden">
				<PropertiesPanel />

				<Flex height="100%" spacing={0} overflow="hidden" flexDirection="column" flexGrow="3">
					<TracksView
						tracks={tracks}
						onAddTrack={AddTrack}
						selected={selectedIndex}
						setSelected={setSelectedIndex}
					/>
					<PianoRoll
						isPlaying={isPlaying}
						bpm={bpm}
						track={tracks[selectedIndex]}
						setNotes={SetNotes}
						numCols={numCols}
					/>
				</Flex>
			</Flex>
			<PlayBackController isPlaying={isPlaying} toggleIsPlaying={ToggleIsPlaying} setBPM={setBPM} />
		</Flex>
	);
};
