const path = require(`path`);

module.exports = {
	webpack: {
		alias: {
			'@': path.resolve(__dirname, 'src/'),
			'@Components': path.resolve(__dirname, 'src/components'),
			'@Instruments': path.resolve(__dirname, 'src/assets/instruments'),
			'@Soundfonts': path.resolve(__dirname, 'src/assets/soundfonts')
		}
	}
};
