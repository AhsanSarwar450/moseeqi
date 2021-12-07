import { Flex } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import * as Tone from 'tone';

import { PlayBackController } from '@Components/studio/PlaybackController';
import { PianoRoll } from '@Components/studio/PianoRoll';
import { TracksView } from '@Components/studio/TracksView';
import { PropertiesPanel } from '@Components/studio/PropertiesPanel';

import { Instruments } from '@Instruments/Instruments';

const numNotes = 4;

export const Studio = () => {
	const [ numCols, setNumCols ] = useState(numNotes * 8);
	const [ isPlaying, setIsPlaying ] = useState(false);
	const [ tracks, setTracks ] = useState([
		{
			instrument: Instruments[0],
			notes: [],
			sampler: null
		}
	]);
	const [ bpm, setBPM ] = useState(120);
	const [ selectedIndex, setSelectedIndex ] = useState(0);

	const ToggleIsPlaying = () => {
		console.log('toggle');
		setIsPlaying(!isPlaying);
	};

	useEffect(() => {
		setTracks([
			{
				instrument: Instruments[0],
				notes: [],
				sampler: new Tone.Sampler({
					urls: Instruments[0].urls,
					release: 1
				}).toDestination()
			}
		]);
	}, []);

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
		console.log(instrument);
	};

	const SetNotes = (notes) => {
		let copy = [ ...tracks ];
		copy[selectedIndex].notes = notes;
		console.log('In Studio');
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
