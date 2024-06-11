import React from 'react';
import { Panel } from '@midasit-dev/moaui';
import { v4 as uuidv4 } from 'uuid';
import ToComponent from './ToComponent';
import { Canvas, Canvases, Layer } from '../Common/types';

export default function SchemaToUI(props: { canvas: Canvas }) {
	const { canvas } = props;

	return (
		<React.Fragment>
			{/* canvases is object */}
			<div
				style={{
					width: '100%',
					height: 26,
					backgroundColor: '#000000',
					borderTopLeftRadius: '5px',
					borderTopRightRadius: '5px',
					color: '#fff',
					display: 'flex',
					justifyContent: 'flex-start',
					alignItems: 'center',
					paddingLeft: '10px',
					fontSize: '12px',
					fontWeight: '400',
					fontFamily: 'pretendard',
				}}
			>
				Title
			</div>
			<div
				key={'PanelCanvas-' + uuidv4().slice(0, 8)}
				style={{
					width: canvas.width,
					height: canvas.height,
					borderLeft: '1px solid #c1c1c3',
					borderRight: '1px solid #c1c1c3',
					borderBottom: '1px solid #c1c1c3',
					backgroundColor: '#fff',
					position: 'relative',
					borderBottomLeftRadius: '5px',
					borderBottomRightRadius: '5px',
				}}
			>
				{canvas.layers.map((layer: Layer, index: number) => {
					return <ToComponent key={index} layer={layer} />;
				})}
			</div>
		</React.Fragment>
	);
}
