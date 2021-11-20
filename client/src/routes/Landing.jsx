import { Navbar } from '../components/NavBar';
import { Box } from '@chakra-ui/layout';
import { MusicVisualizer } from '../components/MusicVisualizer';
import { Footer } from '../components/Footer';

export const Landing = () => (
	<div>
		<Box h="100vh" w="full" bg="brand.primary">
			{/* <Navbar /> */}
			<MusicVisualizer />
		</Box>
		<Box h="100vh" w="full" bg="brand.secondary" />
		<Footer />
	</div>
);
