import React, { Fragment, useRef, useEffect } from 'react';
import { Button, IconButton, Box, VStack, HStack, useDisclosure } from '@chakra-ui/react';
import { TiPlus } from 'react-icons/ti';
import { BiDuplicate } from 'react-icons/bi';
import { Resizable } from 'react-resizable';
import Ruler from '@scena/react-ruler';
import Draggable from 'react-draggable';

import { AddTrackModal } from '@Components/studio/AddTrackModal';
import { Instruments, MusicNotes } from '@Instruments/Instruments';
import * as Tone from 'tone';
import { useState } from 'react';
import './Resizable.css';

const TimeLineHandle = ({ seek, setSeek }) => {
	const seekHandleRef = useRef(null);
	const dragging = useRef(false);

	// useEffect(
	// 	() => {
	// 		if (isPlaying) {

	// 		} else {

	// 		}
	// 	},
	// 	[ isPlaying ]
	// );

	const HandleDrag = (event, data) => {
		setSeek(data.lastX / 5);
		Tone.Transport.seconds = data.lastX / 20;
		dragging.current = false;
	};

	return (
		<Draggable
			axis="x"
			handle=".handle"
			defaultPosition={{ x: 0, y: 0 }}
			position={dragging.current ? null : { x: seek * 5, y: 0 }}
			grid={[ 5, 5 ]}
			scale={1}
			bounds={{ left: 0, right: 10000 }}
			onStart={() => (dragging.current = true)}
			onStop={HandleDrag}
			nodeRef={seekHandleRef}
		>
			{/* <div className="handle">Drag from here</div> */}
			<Box
				ref={seekHandleRef}
				zIndex={1500}
				position="absolute"
				bgColor="brand.accent2"
				//left={`${300 + seek}px`}
				height="full"
				width="1px"
			>
				<Box
					className="handle"
					//zIndex={1501}
					bgColor="brand.accent2"
					marginLeft="-10px"
					width="20px"
					height="20px"
				/>
			</Box>
		</Draggable>
	);
};

export const TracksView = ({
	isPlaying,
	tracks,
	onAddTrack,
	selected,
	setSelected,
	activeWidth,
	setActiveWidth,
	seek,
	setSeek
}) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const timeScale = useRef(null);

	useEffect(() => {
		timeScale.current.resize();
		window.addEventListener('resize', () => {
			timeScale.current.resize();
		});
		return () => {
			window.removeEventListener('resize', () => {
				timeScale.current.resize();
			});
		};
	}, []);

	const OnSetActiveWidth = (event, { element, size, handle }) => {
		setActiveWidth(size.width);
	};

	return (
		<Fragment>
			<VStack spacing={0} position="relative" width="full" height="100%" overflow="auto" bgColor="primary.600">
				<HStack borderBottom="1px solid gray" height="30px" spacing={0} width="full" flexShrink="0">
					<HStack
						paddingLeft={1}
						height="full"
						width="300px"
						spacing={1}
						justifyContent="flex-start"
						bgColor="primary.500"
					>
						<IconButton
							colorScheme="secondary"
							size="xs"
							aria-label="add-track"
							icon={<TiPlus />}
							onClick={onOpen}
							flexShrink="0"
							borderRadius="5px"
						/>
						<IconButton
							colorScheme="secondary"
							size="xs"
							aria-label="duplicate-track"
							icon={<BiDuplicate />}
							flexShrink="0"
							borderRadius="5px"
						/>
					</HStack>
					<Box height="full" width="full" padding="0px">
						<TimeLineHandle seek={seek} setSeek={setSeek} />
						<Ruler type="horizontal" unit={1} zoom={20} ref={timeScale} />
					</Box>
				</HStack>

				{tracks.map((track, index) => (
					<HStack
						borderBottom="1px solid gray"
						height={`${MusicNotes.length}px`}
						padding={0}
						spacing={0}
						width="full"
						key={index}
					>
						<Box
							height="full"
							color="white"
							padding={1}
							width="300px"
							bgColor={selected === index ? 'secondary.500' : 'primary.500'}
							onClick={() => setSelected(index)}
						>
							{track.name}
						</Box>
						<Box
							height="full"
							color="white"
							width="full"
							bgColor="primary.400"
							padding="0px"
							position="relative"
							onClick={() => setSelected(index)}
						>
							<Resizable
								position="absolute"
								left={0}
								top={0}
								height={1}
								bgColor="primary.700"
								width={activeWidth}
								onResize={OnSetActiveWidth}
								axis="x"
								draggableOpts={{ grid: [ 5, 5 ] }}
								resizeHandles={[ 'e' ]}
							>
								<Box height="full" width={activeWidth} overflow="hidden">
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
							</Resizable>
						</Box>
					</HStack>
				))}
			</VStack>
			<AddTrackModal onClose={onClose} isOpen={isOpen} onSubmit={onAddTrack} />
		</Fragment>
	);
};
