import { Box, Spacer, Flex, Container, VStack, HStack, ButtonGroup, Button } from '@chakra-ui/react';
// import { PlayBackController } from '../components/studio/PlaybackController';
import { StudioEditBar } from '../components/studio/StudioEditBar';
import { PlayBackController } from '../components/studio/PlaybackController';
import { Midi } from '../components/Midi';
import { Sequencer } from '../components/Sequencer';
import { PianoRoll } from '../components/studio/PianoRoll';
import { useState } from 'react';

export const Studio = () => {
	const [ isPlaying, setIsPlaying ] = useState(false);

	const ToggleIsPlaying = () => {
		console.log('toggle');
		setIsPlaying(!isPlaying);
	};

	return (
		<Flex height="100vh" width="full" padding={0} margin={0} spacing={0} overflow="hidden" flexDirection="column">
			{/* <Editor /> */}
			<StudioEditBar />
			<PianoRoll isPlaying={isPlaying} />
			<PlayBackController isPlaying={isPlaying} toggleIsPlaying={ToggleIsPlaying} />
			{/* <Midi /> */}
			{/* <Sequencer />*/}
		</Flex>
	);
};
