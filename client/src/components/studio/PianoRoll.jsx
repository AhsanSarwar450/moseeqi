import { useState, useEffect, Fragment } from 'react';
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
// import { Grid, AutoSizer } from 'react-virtualized';
import { StickyGrid } from '../StickyGrid';
import AutoSizer from 'react-virtualized-auto-sizer';

const notes = [
	'A0',
	'A#0',
	'B0',

	'C1',
	'C#1',
	'D1',
	'D#1',
	'E1',
	'F1',
	'F#1',
	'G1',
	'G#1',
	'A1',
	'A#1',
	'B1',

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
	'B5',

	'C6',
	'C#6',
	'D6',
	'D#6',
	'E6',
	'F6',
	'F#6',
	'G6',
	'G#6',
	'A6',
	'A#6',
	'B6',

	'C7',
	'C#7',
	'67',
	'D#7',
	'E7',
	'F7',
	'F#7',
	'G7',
	'G#7',
	'A7',
	'A#7',
	'B7'
];

const numRows = notes.length;
const colors = notes.map((x) => (x.includes('#') ? 'primary.600' : 'primary.500'));

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

const GridCell = ({ data, rowIndex, columnIndex, style }) => {
	const found = data.chords[columnIndex].find((el) => el.name === notes[rowIndex]);

	const HandleOnClick = () => {
		data.onCellClick(columnIndex, rowIndex);
	};

	const HandleOnFilledClick = () => {
		data.onFilledClick(columnIndex, rowIndex);
	};

	return (
		<Box
			onClick={found ? null : HandleOnClick}
			bgColor={colors[rowIndex]}
			overflowX="visible"
			zIndex={999 - columnIndex}
			style={style}
			borderBottom="1px solid gray"
			borderRight="1px solid gray"
		>
			{found !== undefined ? (
				<Box
					borderRadius="5px"
					borderWidth="1px"
					borderColor="secondary.700"
					height="100%"
					width={`calc(${found.duration * 400}% + ${found.duration * 4}px - 1px)`}
					bgColor="secondary.500"
					onClick={HandleOnFilledClick}
				/>
			) : null}
		</Box>
	);
};

export const PianoRoll = ({ isPlaying, bpm }) => {
	const cellWidth = 8;
	const noteWidth = cellWidth * 8;
	const cellHeight = 6;
	const numNotes = 8;
	const options = [ 'Whole', '1/2', '1/4', '1/8' ];

	const [ currentStepIndex, setCurrentStepIndex ] = useState(0);
	const [ numCols, setNumCols ] = useState(numNotes * 8);
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
				setNoteLength(cellWidth * 8);
				setNoteDivisor(1);
			} else if (value === '1/2') {
				setNoteLength(cellWidth * 4);
				setNoteDivisor(2);
			} else if (value === '1/4') {
				setNoteLength(cellWidth * 2);
				setNoteDivisor(4);
			} else if (value === '1/8') {
				setNoteLength(cellWidth);
				setNoteDivisor(8);
			}
		}
	});

	const group = getRootProps();

	const OnCellClick = (column, row) => {
		let currentColumn = chords[column];
		currentColumn.push({ name: notes[row], duration: 60 * 4 / (bpm * noteDivisor), velocity: 1.0 });

		let newChords = _.cloneDeep(chords);
		newChords[column] = currentColumn;
		setChords(newChords);
	};

	// useEffect(
	// 	() => {
	// 		console.log(chords);
	// 	},
	// 	[ chords ]
	// );

	const OnFilledCellClick = (column, row) => {
		let newChords = _.cloneDeep(chords);
		newChords[column] = chords[column].filter((el) => el.name !== notes[row]);
		setChords(newChords);
	};

	return (
		<Flex flexDirection="column" height="full" width="full">
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
			<Container
				height="full"
				width="full"
				maxWidth="full"
				margin={0}
				padding={0}
				spacing={0}
				overflowY="hidden"
				overflowX="hidden"
			>
				<AutoSizer>
					{({ height, width }) => (
						<StickyGrid
							height={height}
							width={width}
							columnCount={numCols}
							rowCount={numRows}
							rowHeight={30}
							columnWidth={60}
							stickyHeight={30}
							stickyWidth={150}
							rowHeaderLabels={notes}
							activeRowIndex={currentStepIndex}
							itemData={{ onCellClick: OnCellClick, onFilledClick: OnFilledCellClick, chords: chords }}
						>
							{GridCell}
						</StickyGrid>
					)}
				</AutoSizer>

				<Song isPlaying={isPlaying} bpm={bpm * 2}>
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
			</Container>
		</Flex>
	);
};

// // Simplified Piano Roll
