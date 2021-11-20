import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Navbar } from '../components/NavBar';
import { Heading } from '@chakra-ui/react';
import { Section } from '../components/Sections';
import { Html, RoundedBox } from '@react-three/drei';

const HTMLContent = () => {
	return (
		<Section factor={1.5} offset={1}>
			<group position={[ 0, 250, 0 ]}>
				<Html fullscreen>
					<div className="container">
						<h1>Hello</h1>
					</div>
				</Html>
			</group>
		</Section>
	);
};

export const Test3D = () => {
	return (
		<div>
			{/* <Navbar /> */}
			<Canvas colorManagement camera-={{ position: [ 0, 0, 120 ], fov: 70 }}>
				<HTMLContent />
			</Canvas>
		</div>
	);
};
