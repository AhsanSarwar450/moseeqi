import { useState, useEffect } from 'react';
import {
	HStack,
	VStack,
	Container,
	Box,
	Flex,
	SimpleGrid,
	useBoolean,
	useRadio,
	useRadioGroup
} from '@chakra-ui/react';
import { Song, Track, Instrument } from 'reactronica';
import _ from 'lodash';
import { AcousticGrandPiano } from '@Instruments/AcousticGrandPiano';

const notes = [
	'C2',
	'C#2',
	'D2',
	'D#2',
	'E2',
	'F2',
	'F#2',
	'G2',
	'G#2',
	'A2',
	'A#2',
	'B2',
	'C3',
	'C#3',
	'D3',
	'D#3',
	'E3',
	'F3',
	'F#3',
	'G3'
	// 'G#3',
	// 'A3',
	// 'A#3',
	// 'B3',
	// 'C4',
	// 'C#4',
	// 'D4',
	// 'D#4',
	// 'E4',
	// 'F4',
	// 'F#4',
	// 'G4',
	// 'G#4',
	// 'A4',
	// 'A#4',
	// 'B4',
	// 'C5',
	// 'C#5',
	// 'D5',
	// 'D#5',
	// 'E5',
	// 'F5',
	// 'F#5',
	// 'G5',
	// 'G#5',
	// 'A5',
	// 'A#5',
	// 'B5'
];

const numRows = notes.length;
const colors = notes.map((x) => (x.includes('#') ? 'primary.600' : 'primary.500'));
const labelColors = notes.map((x) => (x.includes('#') ? 'primary.400' : 'primary.200'));

const LabelPanel = ({ numNotes, width, height, currentStepIndex }) => {
	return (
		<HStack spacing={0}>
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
		<VStack spacing={0} position="sticky" left={0} zIndex={1000}>
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

const Cell = ({ height, width, filledWidth, bgColor, onClick, onFilledClick, duration }) => {
	const [ isActive, setActive ] = useState(false);
	const [ filledLength, setFilledLength ] = useState(0);

	const onClickHandler = () => {
		onClick();
		setFilledLength(filledWidth);
		setActive(true);
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
					width={filledLength}
					onClick={() => {
						onFilledClick();
						setActive(false);
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
			//marginRight={-width / 2}
			marginRight={-1000}
			// top={y * height}
			// left={x * width}
			bgColor="brand.secondary"
			borderWidth="1px"
			borderRadius="5px"
			borderColor="secondary.100"
		/>
	);
};

const ButtonRadio = (props) => {
	const { getInputProps, getCheckboxProps } = useRadio(props);

	const input = getInputProps();
	const checkbox = getCheckboxProps();

	return (
		<Box as="label">
			<input {...input} />
			<Box
				{...checkbox}
				cursor="pointer"
				borderWidth="1px"
				borderColor="secondary.700"
				_checked={{
					bg: 'secondary.500',
					color: 'white'
				}}
				padding={1}
				textColor="white"
				fontSize="sm"
			>
				{props.children}
			</Box>
		</Box>
	);
};

// const GetInstrument({name})=>{

// 	return
// }

export const PianoRoll = ({ isPlaying, bpm }) => {
	const cellWidth = 16;
	const noteWidth = cellWidth * 4;
	const cellHeight = 6;
	const numNotes = 2;
	const options = [ 'Whole', '1/2', '1/4' ];

	const [ currentStepIndex, setCurrentStepIndex ] = useState(0);
	const [ numCols, setNumCols ] = useState(numNotes * 4);
	const [ chords, setChords ] = useState(Array(numCols).fill().map(() => Array(0)));
	// const [ chordsIndex, setChordsIndex ] = useState(Array(numCols).fill().map(() => Array(0)));
	const [ previewNote, setPreviewNote ] = useState(null);
	const [ noteLength, setNoteLength ] = useState(cellWidth);
	const [ noteDivisor, setNoteDivisor ] = useState(4);

	const { getRootProps, getRadioProps } = useRadioGroup({
		name: 'Note Length',
		defaultValue: '1/4',
		onChange: (value) => {
			if (value === 'Whole') {
				setNoteLength(cellWidth * 4);
				setNoteDivisor(1);
			} else if (value === '1/2') {
				setNoteLength(cellWidth * 2);
				setNoteDivisor(2);
			} else if (value === '1/4') {
				setNoteLength(cellWidth);
				setNoteDivisor(4);
			}
		}
	});

	const group = getRootProps();

	const OnCellClick = (column, row) => {
		let currentColumn = chords[column];
		const index = currentColumn.indexOf(notes[row]);

		currentColumn.push({ name: notes[row], duration: 60 * 4 / (bpm * noteDivisor), velocity: 1.0 });

		let newChords = _.cloneDeep(chords);
		newChords[column] = currentColumn;
		setChords(newChords);
	};

	const OnFilledCellClick = (column, row) => {
		let currentColumn = chords[column];
		const index = currentColumn.indexOf(notes[row]);

		currentColumn.splice(index, 1);

		let newChords = _.cloneDeep(chords);
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
			<Flex flexDirection="column" spacing={0} position="sticky" top={0} zIndex={9999}>
				<HStack
					w="full"
					height="20px"
					flexShrink={0}
					padding={5}
					spacing={10}
					bg="brand.primary"
					position="sticky"
					left={0}
				>
					<HStack {...group} spacing={0}>
						{options.map((value) => {
							const radio = getRadioProps({ value });
							return (
								<ButtonRadio key={value} {...radio}>
									{value}
								</ButtonRadio>
							);
						})}
					</HStack>
				</HStack>
				<LabelPanel
					numNotes={numNotes}
					width={cellWidth}
					height={cellHeight}
					currentStepIndex={currentStepIndex}
				/>
			</Flex>

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
					<VStack key={x} spacing={0} height="100%" maxWidth={noteWidth} zIndex={999 - x}>
						{[ ...Array(numRows) ].map((e2, y) => (
							<Cell
								key={y}
								width={cellWidth}
								filledWidth={noteLength}
								height={cellHeight}
								bgColor={colors[y]}
								duration={2}
								onClick={() => OnCellClick(x, y)}
								onFilledClick={() => OnFilledCellClick(x, y)}
							/>
						))}
					</VStack>
				))}
			</HStack>

			<Song isPlaying={isPlaying} bpm={bpm}>
				<Track
					steps={chords}
					// Callback triggers on every step
					onStepPlay={(stepNotes, index) => {
						setCurrentStepIndex(index);
					}}
				>
					<Instrument
						type="sampler"
						samples={AcousticGrandPiano}
						envelope={{
							attack: 0.3,
							release: 0.3
						}}
					/>
				</Track>
				<Track>
					<Instrument type="sampler" samples={AcousticGrandPiano} notes={previewNote} />
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
