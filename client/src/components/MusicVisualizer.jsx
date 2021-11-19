import React from 'react';
import { Visualizer } from 'react-music-visualizer';

export const MusicVisualizer = () => {
	return (
		<div>
			Hello
			<Visualizer
				audioPreviewUrl="Sparkle.mp3"
				drawOptions={{
					canvasColor: 'rgb(21, 16, 25)',
					lineColor: 'rgb(136, 200, 255)',
					lineAmount: 4,
					strokeWidth: 1
				}}
			/>
		</div>
	);
};
