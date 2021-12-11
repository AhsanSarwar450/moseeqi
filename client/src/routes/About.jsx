import { Navbar } from '../components/NavBar';
import Splitter, { SplitDirection } from '@devbookhq/splitter';
import { Fragment } from 'react';
import { VStack, Flex, Box } from '@chakra-ui/layout';
import Draggable from 'react-draggable';

export const About = () => (
	<Fragment>
		<Draggable
			axis="x"
			handle=".handle"
			defaultPosition={{ x: 0, y: 0 }}
			position={null}
			grid={[ 25, 25 ]}
			scale={1}
			bound="parent"
			// onStart={this.handleStart}
			// onDrag={this.handleDrag}
			// onStop={this.handleStop}
		>
			{/* <div className="handle">Drag from here</div> */}
			<Box
				//ref={seekHandleRef}
				//zIndex={1500}
				//position="absolute"
				bgColor="brand.accent2"
				//left={`${300 + seek}px`}
				height="500px"
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
	</Fragment>
);
