import { ButtonGroup, Button, HStack, Heading } from '@chakra-ui/react';

export const PlayBackController = ({ isPlaying, toggleIsPlaying }) => {
	return (
		<HStack height="20px" width="full" flexShrink={0} padding={5} spacing={10} bg="brand.primary">
			<ButtonGroup size="sm" isAttached variant="solid">
				<Button colorScheme="secondary" onClick={toggleIsPlaying}>
					{isPlaying ? 'Stop' : 'Play'}
				</Button>
				<Button colorScheme="secondary">Stop</Button>
			</ButtonGroup>
		</HStack>
	);
};
