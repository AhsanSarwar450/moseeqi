import React, { useState } from 'react';
import { ButtonGroup, Button, HStack, Heading, VStack, Flex } from '@chakra-ui/react';
import KnobControl from 'components/Knob';

export const PropertiesPanel = ({ numTracks, selectedIndex, release, attack, setAttack, setRelease }) => {
	return (
		<VStack padding="10px" bgColor="primary.700" height="100%" spacing="10px">
			<Heading width="100%" color="white">
				Properties
			</Heading>
			<Heading width="100%" size="sm" color="white">
				Envelope
			</Heading>
			{[ ...Array(numTracks) ].map((value, index) => {
				if (selectedIndex !== index) return null;
				return (
					<Flex width="100%" key={index}>
						<KnobControl
							size={50}
							label="Attack"
							setValue={setAttack}
							defaultVal={attack}
							//defaultVal={0}
						/>
						<KnobControl
							size={50}
							label="Release"
							setValue={setRelease}
							defaultVal={release}
							//defaultVal={1}
						/>
					</Flex>
				);
			})}
		</VStack>
	);
};
