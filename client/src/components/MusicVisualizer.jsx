import React from 'react';
import { Visualizer } from 'react-music-visualizer';

export const MusicVisualizer = () => {
	return (
		<div>
			<Visualizer
				audioPreviewUrl="/Sparkle.mp3"
				drawOptions={{
					lineColor: 'rgb(136, 200, 255)',
					lineAmount: 1,
					strokeWidth: 1
				}}
			/>
		</div>
	);
};
