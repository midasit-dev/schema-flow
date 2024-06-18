import React from 'react';
import { Panel } from '@midasit-dev/moaui';
import { v4 as uuidv4 } from 'uuid';
import ToComponent from './ToComponent';
import { Canvas, Canvases, Layer } from '../Common/types';
import { SvgClose } from '../SVGComps/index';
import RJSFComp from './rjsf';

export default function SchemaToUI(props: {
	nodeId: string;
	schemaInfo: any;
	onRemove: (nodeId: string, functionId: string) => void;
}) {
	const { nodeId, schemaInfo, onRemove } = props;
	const [bgColor, setBgColor] = React.useState('transparent');
	const [canvas, setCanvas] = React.useState<Canvas>({
		width: 300,
		height: 300,
		layers: [],
	});

	React.useEffect(() => {
		if (schemaInfo.schema.canvas === undefined) return;
		setCanvas(schemaInfo.schema.canvas);
	}, [schemaInfo]);

	const handleMouseEnter = React.useCallback(() => {
		setBgColor('gray');
	}, []);

	const handleMouseLeave = React.useCallback(() => {
		setBgColor('transparent');
	}, []);

	const onClickCloseHandler = React.useCallback(() => {
		onRemove(nodeId, schemaInfo.id);
	}, []);

	return (
		<div>
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
					width: '100%',
					height: '100%',
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
				{/* {canvas.layers.map((layer: Layer, index: number) => {
					return <ToComponent key={index} layer={layer} />;
				})} */}
				<RJSFComp schema={schemaInfo.schema} />
			</div>
		</div>
	);
}
