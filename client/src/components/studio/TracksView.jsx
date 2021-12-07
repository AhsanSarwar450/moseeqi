import React, { Fragment } from 'react';
import { Button, Box, VStack, HStack, useDisclosure } from '@chakra-ui/react';

import { AddTrackModal } from '@Components/studio/AddTrackModal';
import { Instruments, MusicNotes } from '@Instruments/Instruments';

export const TracksView = ({ tracks, onAddTrack, selected, setSelected }) => {
	const { isOpen, onOpen, onClose } = useDisclosure();

	const AddTrack = (instrument) => {};

	const SelectTrack = (index) => {
		setSelected(index);
	};

	return (
		<Fragment>
			<VStack spacing={0} width="full" flexGrow="1" overflow="auto">
				<Button onClick={onOpen} flexShrink="0">
					Add
				</Button>

				{tracks.map((track, index) => (
					<HStack
						borderBottom="1px solid gray"
						height={`${MusicNotes.length}px`}
						spacing={0}
						width="full"
						flexShrink="0"
						key={index}
					>
						<Box
							height="full"
							maxWidth="300px"
							color="white"
							width="30%"
							bgColor={selected === index ? 'secondary.500' : 'primary.500'}
							padding="5px"
							onClick={() => setSelected(index)}
						>
							{track.instrument.name}
						</Box>
						<Box
							height="full"
							color="white"
							width="full"
							bgColor="primary.700"
							padding="5px"
							position="relative"
							onClick={() => setSelected(index)}
						>
							{track.notes.map((note, index) => (
								<Box
									key={index}
									bgColor="secondary.500"
									position="absolute"
									top={`${note.noteIndex}px`}
									left={`${5 * note.time}px`}
									width={`${5 * 8 / note.duration}px`}
									height="1px"
								/>
							))}
						</Box>
					</HStack>
				))}
			</VStack>
			<AddTrackModal onClose={onClose} isOpen={isOpen} onSubmit={onAddTrack} />
		</Fragment>
	);
};
