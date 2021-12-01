import { Box } from '@chakra-ui/react';
import React from 'react';
import { useBoolean } from '@chakra-ui/hooks';

export const Cell = ({ x, y, onClick, height, width, bgColor }) => {
	const [ isActive, setActive ] = useBoolean(false);

	const onClickHandler = () => {
		onClick();
		setActive.toggle();
	};

	return (
		<Box
			width={width}
			height={height}
			bg={isActive ? 'secondary.500' : bgColor}
			borderWidth="1px"
			borderColor="primary.100"
			onClick={onClickHandler}
		/>
	);
};
