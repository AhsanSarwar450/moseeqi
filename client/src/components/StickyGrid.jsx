import { createContext, forwardRef, useState } from 'react';
import { FixedSizeGrid as Grid } from 'react-window';
import { Box, Flex, HStack } from '@chakra-ui/react';

const blackKeyWidth = 0.6;

const pianoOctaveStyles = [
	{
		background: 'white',
		color: 'black',
		topOffset: -0.5,
		widthModifier: 1,
		heightModifier: 2,
		alignItems: 'center'
	},
	{
		background: 'black',
		color: 'white',
		topOffset: 0,
		widthModifier: blackKeyWidth,
		heightModifier: 1,
		zIndex: 4,
		alignItems: 'center'
	},
	{
		background: 'white',
		color: 'black',

		topOffset: -0.5,
		widthModifier: 1,
		heightModifier: 1.5,
		alignItems: 'flex-end'
	},
	{
		background: 'white',
		color: 'black',
		topOffset: 0,
		widthModifier: 1,
		heightModifier: 1.5
	},
	{
		background: 'black',
		color: 'white',
		topOffset: 0,
		widthModifier: blackKeyWidth,
		heightModifier: 1,
		zIndex: 4,
		alignItems: 'center'
	},
	{
		background: 'white',
		color: 'black',
		topOffset: -0.5,
		widthModifier: 1,
		heightModifier: 2,
		alignItems: 'center'
	},
	{
		background: 'black',
		color: 'white',
		topOffset: 0,
		widthModifier: blackKeyWidth,
		heightModifier: 1,
		zIndex: 4,
		alignItems: 'center'
	},
	{
		background: 'white',
		color: 'black',
		topOffset: -0.5,
		widthModifier: 1,
		heightModifier: 1.5,
		alignItems: 'flex-end'
	},
	{
		background: 'white',
		color: 'black',
		topOffset: 0,
		widthModifier: 1,
		heightModifier: 1.5
	},
	{
		background: 'black',
		color: 'white',
		topOffset: 0,
		widthModifier: blackKeyWidth,
		heightModifier: 1,
		zIndex: 4,
		alignItems: 'center'
	},
	{
		background: 'white',
		color: 'black',
		topOffset: -0.5,
		widthModifier: 1,
		heightModifier: 2,
		alignItems: 'center'
	},
	{
		background: 'black',
		color: 'white',
		topOffset: 0,
		widthModifier: blackKeyWidth,
		heightModifier: 1,
		zIndex: 4,
		alignItems: 'center'
	}
];

const getRenderedCursor = (children) =>
	children.reduce(
		([ minRow, maxRow, minColumn, maxColumn ], { props: { columnIndex, rowIndex } }) => {
			if (rowIndex < minRow) {
				minRow = rowIndex;
			}
			if (rowIndex > maxRow) {
				maxRow = rowIndex;
			}
			if (columnIndex < minColumn) {
				minColumn = columnIndex;
			}
			if (columnIndex > maxColumn) {
				maxColumn = columnIndex;
			}

			return [ minRow, maxRow, minColumn, maxColumn ];
		},
		[ Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY ]
	);

const headerBuilder = (minColumn, maxColumn, columnWidth, stickyHeight, activeRowIndex) => {
	const columns = [];

	for (let i = minColumn; i <= maxColumn; i++) {
		columns.push({
			height: stickyHeight,
			width: columnWidth,
			left: i * columnWidth,
			first: i % 8 === 0,
			isActive: i === activeRowIndex,
			index: i,
			label: ''
		});
	}

	return columns;
};

const columnsBuilder = (minRow, maxRow, rowHeight, stickyWidth, labels) => {
	const rows = [];

	for (let i = minRow; i <= maxRow; i++) {
		let styles = pianoOctaveStyles[i % 12];
		let keyHeight = rowHeight * styles.heightModifier;
		let keyWidth = stickyWidth * styles.widthModifier;
		// rows.push({
		// 	height: rowHeight,
		// 	width: stickyWidth,
		// 	top: i * rowHeight,
		// 	label: labels[i]
		// });
		rows.push({
			height: keyHeight,
			width: keyWidth,
			top: rowHeight * i + styles.topOffset * rowHeight,
			label: labels[i],
			zIndex: styles.zIndex,
			...styles
		});
	}

	return rows;
};

const StickyHeader = ({ stickyHeight, stickyWidth, headerColumns }) => {
	return (
		<Flex zIndex={1001} position="sticky" top={0} left={0}>
			<Box
				zIndex={1001}
				position="sticky"
				left={0}
				bgColor="primary.600"
				paddingLeft="10px"
				borderBottom="1px solid gray"
				borderRight="1px solid gray"
				width={stickyWidth}
				height={stickyHeight}
			/>
			<Box position="absolute" left={stickyWidth}>
				{headerColumns.map(({ label, ...style }, i) => (
					<Flex
						spacing={0}
						color="white"
						justifyContent="center"
						alignItems="center"
						bgColor={style.isActive ? 'brand.secondary' : style.first ? 'brand.accent2' : 'brand.accent1'}
						position="absolute"
						borderBottom="1px solid gray"
						borderRight="1px solid gray"
						style={style}
						key={i}
					>
						{style.first ? style.index / 8 + 1 : ''}
					</Flex>
				))}
			</Box>
		</Flex>
	);
};

const StickyColumns = ({ rows, stickyHeight, stickyWidth }) => {
	return (
		<Box
			zIndex={1000}
			left={0}
			background="black"
			position="sticky"
			top={stickyHeight}
			width={stickyWidth}
			height={`calc(100% - ${stickyHeight}px)`}
		>
			{rows.map(({ label, ...style }, i) => (
				<Flex
					position="absolute"
					paddingLeft="10px"
					border="1px solid gray"
					justifyContent="right"
					paddingRight="5px"
					borderRadius="5px"
					//borderRight="1px solid gray"
					style={style}
					key={i}
				>
					{label}
				</Flex>
				// <Box style={style}>{pianoKeys[i % 12]}</Box>
			))}
		</Box>
	);
};

const StickyGridContext = createContext();
StickyGridContext.displayName = 'StickyGridContext';

const innerGridElementType = forwardRef(({ children, ...rest }, ref) => (
	<StickyGridContext.Consumer>
		{({
			stickyHeight,
			stickyWidth,
			headerBuilder,
			columnsBuilder,
			columnWidth,
			rowHeight,
			rowHeaderLabels,
			activeRowIndex
		}) => {
			const [ minRow, maxRow, minColumn, maxColumn ] = getRenderedCursor(children); // TODO maybe there is more elegant way to get this
			const headerColumns = headerBuilder(minColumn, maxColumn, columnWidth, stickyHeight, activeRowIndex);
			const leftSideRows = columnsBuilder(minRow, maxRow, rowHeight, stickyWidth, rowHeaderLabels);
			const containerStyle = {
				...rest.style,
				width: `${parseFloat(rest.style.width) + stickyWidth}px`,
				height: `${parseFloat(rest.style.height) + stickyHeight}px`
			};
			const containerProps = { ...rest, style: containerStyle };

			return (
				<Box ref={ref} {...containerProps}>
					<StickyHeader headerColumns={headerColumns} stickyHeight={stickyHeight} stickyWidth={stickyWidth} />
					<StickyColumns rows={leftSideRows} stickyHeight={stickyHeight} stickyWidth={stickyWidth} />

					<Box position="absolute" top={stickyHeight} left={stickyWidth}>
						{children}
					</Box>
				</Box>
			);
		}}
	</StickyGridContext.Consumer>
));

export const StickyGrid = ({
	stickyHeight,
	stickyWidth,
	columnWidth,
	rowHeight,
	rowHeaderLabels,
	activeRowIndex,
	children,
	...rest
}) => (
	<StickyGridContext.Provider
		value={{
			stickyHeight,
			stickyWidth,
			columnWidth,
			rowHeight,
			rowHeaderLabels,
			activeRowIndex,
			headerBuilder,
			columnsBuilder
		}}
	>
		<Grid columnWidth={columnWidth} rowHeight={rowHeight} innerElementType={innerGridElementType} {...rest}>
			{children}
		</Grid>
	</StickyGridContext.Provider>
);
