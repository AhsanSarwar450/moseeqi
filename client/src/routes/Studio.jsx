import { Flex } from '@chakra-ui/react';
// import { PlayBackController } from '../components/studio/PlaybackController';
import { PlayBackController } from '../components/studio/PlaybackController';
import { PianoRoll } from '../components/studio/PianoRoll';
import { useState } from 'react';

export const Studio = () => {
	const [ isPlaying, setIsPlaying ] = useState(false);
	const [ bpm, setBPM ] = useState(120);

	const ToggleIsPlaying = () => {
		console.log('toggle');
		setIsPlaying(!isPlaying);
	};

	return (
		<Flex height="100vh" width="full" spacing={0} overflow="hidden" flexDirection="column">
			{/* <Editor /> */}
			{/* <StudioEditBar setNoteDivisor={setNoteDivisor} /> */}
			<PianoRoll isPlaying={isPlaying} bpm={bpm} />
			<PlayBackController isPlaying={isPlaying} toggleIsPlaying={ToggleIsPlaying} setBPM={setBPM} />
			{/* <Midi /> */}
			{/* <Sequencer />*/}
		</Flex>
	);
};
