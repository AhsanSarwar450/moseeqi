import { useState, useEffect } from 'react';
import { HStack, VStack, Container, Box, Flex, SimpleGrid, useBoolean } from '@chakra-ui/react';
import { Song, Track, Instrument } from 'reactronica';
import _ from 'lodash';

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

const LabelPanel = ({ numNotes, width, height, currentStepIndex }) => {
	return (
		<HStack spacing={0} position="sticky" top={0}>
			<Box minWidth={width} height={height} bgColor="primary.500" borderWidth="1px" borderColor="primary.100" />
			{[ ...Array(numNotes) ].map((e2, x) => (
				<TimeLabel
					key={x}
					noteNum={x}
					divisions={4}
					divisionWidth={width}
					height={height}
					currentStepIndex={currentStepIndex}
				/>
			))}
		</HStack>
	);
};

const TimeLabel = ({ noteNum, divisionWidth, divisions, currentStepIndex, height }) => {
	return (
		<HStack spacing={0} boxShadow="inner">
			{[ ...Array(divisions) ].map((e2, x) => (
				<Box
					key={noteNum * divisions + x}
					minWidth={divisionWidth}
					height={height}
					// fontSize="sm"
					// textColor="white"
					// textAlign="center"
					// verticalAlign="middle"
					// lineHeight={height}
					bgColor={currentStepIndex === noteNum * divisions + x ? 'brand.accent2' : 'brand.accent1'}
					borderWidth="1px"
					borderColor="primary.100"
				/>
			))}
		</HStack>
	);
};

const NotesPanel = ({ width, height, setPreviewNote }) => {
	return (
		<VStack spacing={0} position="sticky" left={0}>
			{[ ...Array(numRows) ].map((e2, y) => (
				<Box
					key={y}
					width={width}
					height={height}
					fontSize="sm"
					textColor="white"
					textAlign="center"
					verticalAlign="middle"
					lineHeight={height}
					bgColor={labelColors[y]}
					borderWidth="1px"
					borderColor="primary.100"
					onMouseDown={() => setPreviewNote([ { name: notes[y] } ])}
					onMouseUp={() => setPreviewNote(null)}
				>
					{notes[y]}
				</Box>
			))}
		</VStack>
	);
};

const Cell = ({ height, width, bgColor, onClick, duration }) => {
	const [ isActive, setActive ] = useBoolean(false);

	const onClickHandler = () => {
		onClick();
		setActive.toggle();
	};

	return (
		<div>
			<Box
				width={width}
				height={height}
				onClick={onClickHandler}
				bgColor={bgColor}
				borderWidth="1px"
				borderColor="primary.100"
			/>
			{isActive ? (
				<FilledCell
					height={height}
					width={width * duration}
					onClick={() => {
						setActive.toggle();
					}}
				/>
			) : null}
		</div>
	);
};

const FilledCell = ({ height, width, x, y, onClick }) => {
	return (
		<Box
			width={width}
			height={height}
			onClick={onClick}
			marginTop={-height}
			// top={y * height}
			// left={x * width}
			bgColor="brand.secondary"
			borderWidth="1px"
			borderRadius="10%"
			borderColor="secondary.100"
		/>
	);
};

export const PianoRoll = ({ isPlaying }) => {
	const cellWidth = 16;
	const cellHeight = 5;
	const noteWidth = cellWidth * 4;
	const numNotes = 4;

	const [ currentStepIndex, setCurrentStepIndex ] = useState(0);
	// const [ numRows, setNumRows ] = useState(10);
	const [ numCols, setNumCols ] = useState(numNotes * 4);
	const [ chords, setChords ] = useState(Array(numCols).fill().map(() => Array(0)));
	// const [ chordsIndex, setChordsIndex ] = useState(Array(numCols).fill().map(() => Array(0)));
	const [ previewNote, setPreviewNote ] = useState(null);

	const OnCellClick = (column, row) => {
		let currentColumn = chords[column];
		const index = currentColumn.indexOf(notes[row]);
		if (index > -1) {
			currentColumn.splice(index, 1);
		} else {
			currentColumn.push(notes[row]);
		}
		let newChords = _.cloneDeep(chords);
		newChords[column] = currentColumn;
		setChords(newChords);
	};

	// useEffect(
	// 	() => {
	// 		console.log('chords');
	// 	},
	// 	[ chords ]
	// );

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
			<LabelPanel numNotes={numNotes} width={cellWidth} height={cellHeight} currentStepIndex={currentStepIndex} />

			<HStack spacing={0}>
				<NotesPanel width={cellWidth} height={cellHeight} setPreviewNote={setPreviewNote} />
				{/* 
				{chords.map((e, x) => (
					<VStack key={x} spacing={0}>
						{chords[x].map((e2, y) => (
							<FilledCell
								key={y}
								width={cellWidth}
								height={cellHeight}
								x={x}
								y={notes.indexOf(chords[x][y])}
								// onClick={() => OnCellClick(x, y)}
							/>
						))}
					</VStack>
				))} */}

				{[ ...Array(numCols) ].map((e, x) => (
					<VStack key={x} spacing={0} height="100%">
						{[ ...Array(numRows) ].map((e2, y) => (
							<Cell
								key={y}
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
				<Track>
					<Instrument type="amSynth" notes={previewNote} />
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

// <Flex spacing={0} height="full" width="full" overflowX="hidden" overflowY="auto" flexDirection="row">
// 			<VStack spacing={0}>
// 				<HStack spacing={0}>
// 					<Box
// 						minWidth={cellWidth}
// 						height={cellHeight}
// 						bgColor="primary.500"
// 						borderWidth="1px"
// 						borderColor="primary.100"
// 					/>

// 				</HStack>
// 				<NotesPanel width={cellWidth} height={cellHeight} setPreviewNote={setPreviewNote} />
// 			</VStack>

// 			<Flex spacing={0} width="full" overflowX="auto" flexDirection="column">
// 				{/* <SimpleGrid spacing={0} columns={numCols}>
// 					{[ ...Array(numRows * numCols) ].map((e2, i) => (
// 						<Cell
// 							key={i}
// 							width={cellWidth}
// 							height={cellHeight}
// 							bgColor={colors[~~(i / numCols)]}
// 							//onClick={OnCellClick(i % numCols, ~~(i / numCols))}
// 						/>
// 					))}
// 				</SimpleGrid> */}
// 			</Flex>
