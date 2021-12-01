import { ButtonGroup, Button, HStack } from '@chakra-ui/react';

export const StudioEditBar = () => {
	return (
		<HStack w="full" height="20px" flexShrink={0} padding={5} spacing={10} bg="brand.primary">
			<Button colorScheme="secondary" size="sm">
				Draw
			</Button>
		</HStack>
	);
};
