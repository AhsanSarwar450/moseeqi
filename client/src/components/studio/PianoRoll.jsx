import { useState, useEffect } from 'react';
import { HStack, VStack, Container, Box, Flex } from '@chakra-ui/react';
import { Cell } from './Cell';
import { Song, Track, Instrument } from 'reactronica';

export const PianoRoll = ({ isPlaying }) => {
	const notes = [
		'C3',
		'C#3',
		'D3',
		'D#3',
		'E3',
		'F3',
		'F#3',
		'G3',
		'G#3',
		'A3',
		'A#3',
		'B3',
		'C4',
		'C#4',
		'D4',
		'D#4',
		'E4',
		'F4',
		'F#4',
		'G4',
		'G#4',
		'A4',
		'A#4',
		'B4',
		'C5',
		'C#5',
		'D5',
		'D#5',
		'E5',
		'F5',
		'F#5',
		'G5',
		'G#5',
		'A5',
		'A#5',
		'B5'
	];
	const numRows = notes.length;
	const colors = notes.map((x) => (x.includes('#') ? 'primary.600' : 'primary.500'));
	const labelColors = notes.map((x) => (x.includes('#') ? 'primary.400' : 'primary.200'));
	const cellWidth = 16;
	const cellHeight = 9;

	const [ currentStepIndex, setCurrentStepIndex ] = useState(0);
	// const [ numRows, setNumRows ] = useState(10);
	const [ numCols, setNumCols ] = useState(60);
	const [ chords, setChords ] = useState(Array(numCols).fill().map(() => Array(0)));

	const OnCellClick = (column, row) => {
		let currentColumn = chords[column];
		const index = currentColumn.indexOf(notes[row]);
		if (index > -1) {
			currentColumn.splice(index, 1);
		} else {
			currentColumn.push(notes[row]);
		}
		let newChords = chords;
		newChords[column] = currentColumn;
		setChords(newChords);
	};

	return (
		<Flex
			height="full"
			width="full"
			maxWidth="full"
			margin={0}
			padding={0}
			spacing={0}
			overflowY="auto"
			overflowX="auto"
			flexDirection="column"
		>
			<HStack spacing={0}>
				<Box
					minWidth={cellWidth}
					height={cellHeight}
					bgColor="primary.500"
					borderWidth="1px"
					borderColor="primary.100"
				/>

				{[ ...Array(numCols) ].map((e2, x) => (
					<Box
						key={x}
						minWidth={cellWidth}
						height={cellHeight}
						fontSize="sm"
						textColor="white"
						textAlign="center"
						verticalAlign="middle"
						lineHeight={cellHeight}
						bgColor={currentStepIndex === x ? 'brand.accent2' : 'brand.accent1'}
						borderWidth="1px"
						borderColor="primary.100"
					>
						{x + 1}
					</Box>
				))}
			</HStack>
			<HStack spacing={0}>
				<VStack spacing={0} height="100%">
					{[ ...Array(numRows) ].map((e2, y) => (
						<Box
							key={y}
							width={cellWidth}
							height={cellHeight}
							fontSize="sm"
							textColor="white"
							textAlign="center"
							verticalAlign="middle"
							lineHeight={cellHeight}
							bgColor={labelColors[y]}
							borderWidth="1px"
							borderColor="primary.100"
						>
							{notes[y]}
						</Box>
					))}
				</VStack>
				{[ ...Array(numCols) ].map((e, x) => (
					<VStack key={x} spacing={0} height="100%">
						{[ ...Array(numRows) ].map((e2, y) => (
							<Cell
								key={y}
								x={x}
								y={y}
								width={cellWidth}
								height={cellHeight}
								bgColor={colors[y]}
								onClick={() => OnCellClick(x, y)}
							/>
						))}
					</VStack>
				))}
			</HStack>

			<Song isPlaying={isPlaying} bpm={90}>
				<Track
					steps={chords}
					// Callback triggers on every step
					onStepPlay={(stepNotes, index) => {
						setCurrentStepIndex(index);
					}}
				>
					<Instrument type="amSynth" />
				</Track>
			</Song>
		</Flex>
	);
};

// // Simplified Piano Roll
// export const PianoRoll = () => {

// 	return (
// 		<Container>
// 			<Button onClick={() => setIsPlaying(!isPlaying)}>{isPlaying ? 'Stop' : 'Play'}</Button>

// 			<PianoRollEditor currentStepIndex={currentStepIndex} />

// 		</Container>
// 	);
// };
