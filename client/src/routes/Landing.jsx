import { WithSubnavigation } from '../components/NavBar';
import { Box } from '@chakra-ui/layout';

export const Landing = () => (
	<div>
		<Box h="100vh" w="full" bg="brand.primary">
			<WithSubnavigation />
			<Box flex="1" w="full" />
		</Box>
		<Box h="100vh" w="full" bg="brand.secondary" />
	</div>
);
