import React, { useRef } from 'react';
import { Button, Box, Flex, HStack } from '@chakra-ui/react';

export default function VisualDemo(props) {
	const amplitudeValues = useRef(null);

	function adjustFreqBandStyle(newAmplitudeData) {
		amplitudeValues.current = newAmplitudeData;
		let domElements = props.frequencyBandArray.map((num) => document.getElementById(num));
		for (let i = 0; i < props.frequencyBandArray.length; i++) {
			let num = props.frequencyBandArray[i];
			domElements[num].style.backgroundColor = `rgb(0, 255, ${amplitudeValues.current[num]})`;
			domElements[num].style.height = `${amplitudeValues.current[num] * (num + 1) ** 0.5}px`;
		}
	}

	function runSpectrum() {
		props.getFrequencyData(adjustFreqBandStyle);
		requestAnimationFrame(runSpectrum);
	}

	function handleStartBottonClick() {
		props.initializeAudioAnalyser();
		requestAnimationFrame(runSpectrum);
	}

	return (
		<div>
			<Button onClick={() => handleStartBottonClick()}>Start</Button>
			<HStack>
				{props.frequencyBandArray.map((num) => (
					<Box width={10} className={'frequencyBands'} id={num} key={num} />
				))}
			</HStack>
		</div>
	);
}
