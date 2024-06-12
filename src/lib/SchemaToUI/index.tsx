import React from 'react';
import { Panel } from '@midasit-dev/moaui';
import { v4 as uuidv4 } from 'uuid';
import ToComponent from './ToComponent';
import { Canvas, Canvases, Layer } from '../Common/types';
import { SvgClose } from '../SVGComps/index';

export default function SchemaToUI(props: {
	nodeId: string;
	canvas: Canvas;
	onRemove: (id: string) => void;
}) {
	const { nodeId, canvas, onRemove } = props;
	const [bgColor, setBgColor] = React.useState('transparent');

	const handleMouseEnter = () => {
		setBgColor('gray');
	};

	const handleMouseLeave = () => {
		setBgColor('transparent');
	};

	const onClickCloseHandler = () => {
		onRemove(nodeId);
	};

	return (
		<React.Fragment>
			{/* canvases is object */}
			<div
				style={{
					width: '100%',
					height: 26,
					backgroundColor: 'rgba(0, 0, 0, 0.7)',
					borderTopLeftRadius: '5px',
					borderTopRightRadius: '5px',
					color: '#fff',
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					paddingLeft: '10px',
					paddingRight: '5px',
					fontSize: '12px',
					fontWeight: '400',
					fontFamily: 'pretendard',
				}}
			>
				Title
				<div
					style={{
						width: '20px',
						height: '20px',
						cursor: 'pointer',
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						borderRadius: '50%',
						backgroundColor: bgColor,
					}}
					onMouseEnter={handleMouseEnter}
					onMouseLeave={handleMouseLeave}
					onClick={onClickCloseHandler}
				>
					<SvgClose />
				</div>
			</div>
			<div
				key={'PanelCanvas-' + uuidv4().slice(0, 8)}
				style={{
					width: canvas.width,
					height: canvas.height,
					borderLeft: '1px solid #c1c1c3',
					borderRight: '1px solid #c1c1c3',
					borderBottom: '1px solid #c1c1c3',
					backgroundColor: 'rgba(255, 255, 255, 0.7)',
					position: 'relative',
					borderBottomLeftRadius: '5px',
					borderBottomRightRadius: '5px',
				}}
				className='nodrag'
			>
				{canvas.layers.map((layer: Layer, index: number) => {
					return <ToComponent key={index} layer={layer} />;
				})}
			</div>
		</React.Fragment>
	);
}
