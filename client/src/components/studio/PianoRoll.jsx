import { useState, useEffect, Fragment, memo } from 'react';
import { HStack, VStack, Button, Container, Box, Flex, useRadioGroup } from '@chakra-ui/react';
import AutoSizer from 'react-virtualized-auto-sizer';

import { StickyGrid } from '@Components/studio/StickyGrid';
import { ButtonRadio } from '@Components/ButtonRadio';
import { MusicNotes } from '@Instruments/Instruments';

const numRows = MusicNotes.length;
const colors = MusicNotes.map((x) => (x.includes('#') ? 'primary.600' : 'primary.500'));

const GridCell = ({ data, rowIndex, columnIndex, style }) => {
	const HandleOnClick = () => {
		data.onCellClick(columnIndex, rowIndex);
	};
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

export const PianoRoll = ({ track, setNotes, numCols }) => {
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
			note: MusicNotes[row],
			duration: noteDivisor,
			velocity: 1.0
		});
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
							rowHeight={20}
							columnWidth={60}
							stickyHeight={30}
							stickyWidth={150}
							rowHeaderLabels={MusicNotes}
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
