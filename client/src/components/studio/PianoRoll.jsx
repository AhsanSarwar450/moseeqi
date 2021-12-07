import { useState, useEffect, Fragment, memo } from 'react';
import { HStack, VStack, Button, Container, Box, Flex, useRadioGroup } from '@chakra-ui/react';
import { Song, Track, Instrument } from 'reactronica';
import AutoSizer from 'react-virtualized-auto-sizer';
import * as Tone from 'tone';
import { areEqual } from 'react-window';

import { AcousticGrandPiano } from '@Instruments/AcousticGrandPiano';
import { StickyGrid } from '@Components/studio/StickyGrid';
import { ButtonRadio } from '@Components/ButtonRadio';

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

const GridCell = ({ data, rowIndex, columnIndex, style }) => {
	const HandleOnClick = () => {
		data.onCellClick(columnIndex, rowIndex);
	};

	//console.log('Cell render!!!');

	return (
		<Box
			onClick={HandleOnClick}
			bgColor={colors[rowIndex]}
			overflowX="visible"
			zIndex={500 - columnIndex}
			style={style}
			boxShadow={columnIndex % 8 === 7 ? '1px 0 0 gray;' : '0'}
			borderBottom="1px solid gray"
			borderRight="1px solid gray"
		/>
	);
};

export const PianoRoll = ({ isPlaying, bpm, track, setNotes, numCols }) => {
	const cellWidth = 8;
	const noteWidth = cellWidth * 8;
	const cellHeight = 6;

	const options = [ 'Whole', '1/2', '1/4', '1/8' ];

	const [ currentStepIndex, setCurrentStepIndex ] = useState(0);

	const [ noteDivisor, setNoteDivisor ] = useState(4);

	const { getRootProps, getRadioProps } = useRadioGroup({
		name: 'Note Length',
		defaultValue: '1/4',
		onChange: (value) => {
			if (value === 'Whole') {
				setNoteDivisor(1);
			} else if (value === '1/2') {
				setNoteDivisor(2);
			} else if (value === '1/4') {
				setNoteDivisor(4);
			} else if (value === '1/8') {
				setNoteDivisor(8);
			}
		}
	});

	const group = getRootProps();

	const OnCellClick = (column, row) => {
		let copy = [ ...track.notes ];
		copy.push({
			time: column,
			noteIndex: row,
			note: notes[row],
			duration: 60 * 4 / (bpm * noteDivisor),
			velocity: 1.0
		});
		console.log('In Piano');
		setNotes(copy);
	};

	// useEffect(
	// 	() => {
	// 		console.log(notes);
	// 	},
	// 	[ notes ]
	// );

	const OnFilledCellClick = (index) => {
		let copy = [ ...track.notes ];
		copy.splice(index, 1);
		setNotes(copy);
	};

	const OnKeyDown = (key) => {
		track.sampler.triggerAttack([ key ]);
	};

	const OnKeyUp = (key) => {
		track.sampler.triggerRelease([ key ]);
	};

	return (
		<Flex minHeight="50%" flexDirection="column" width="full" flexGrow="1" width="full">
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
				<Button size="sm" onClick={() => setNotes(Array(numCols).fill().map(() => Array(0)))}>
					Clear
				</Button>
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
							onKeyDown={OnKeyDown}
							onKeyUp={OnKeyUp}
							notes={track.notes}
							onFilledNoteClick={OnFilledCellClick}
							itemData={{
								onCellClick: OnCellClick
							}}
						>
							{GridCell}
						</StickyGrid>
					)}
				</AutoSizer>
			</Container>
		</Flex>
	);
};

/* 
				<Song isPlaying={isPlaying} bpm={bpm * 2}>
					<Track
						steps={notes}
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
				</Song> */
// // Simplified Piano Roll
