import { useState, useEffect } from 'react';
import { useRecoilState } from 'recoil';
// import { SelectedLayerIdState } from '../../../../playground/src/lib/Layout/recoilReactFlowState';
import Moaui, { type FloatingBoxProps, FloatingBox } from '@midasit-dev/moaui-components-v1';
import { type Layer } from '../../Common/types';
import { isAvailableComp } from './AvailableComponents';
// import {
// 	components_inner_layer_bgColor,
// 	components_inner_layer_bgColor_selected,
// } from '../../../../playground/src/lib/Common/const';
// import { PageString } from '../../../../playground/src/lib/Common/string';

const ToFloatingBox = (props: { layer: Layer; parentPage: string }) => {
	const { layer, parentPage } = props;

	// const [fill, setFill] = useState(components_inner_layer_bgColor);
	const [opacity, setOpacity] = useState(1);
	const [border, setBorder] = useState('none');

	// const [selectedLayerId, setSelectedLayerId] = useRecoilState(SelectedLayerIdState);

	useEffect(() => {
		// if (parentPage === PageString.Showcase) setFill('transparent');
		// else
		// 	layer.id === selectedLayerId
		// 		? setFill(components_inner_layer_bgColor_selected)
		// 		: setFill(components_inner_layer_bgColor);
	}, [layer.id]);

	const innnerProps: FloatingBoxProps = {
		key: layer.id,
		...layer.props,
		show: true,
		fill: 'transparent',
		opacity: opacity,
		cursor: 'pointer',
		transition: 'opacity 0.4s ease',
		border: border,
		onMouseOver: () => {
			setOpacity(0.7);
			setBorder('1px solid #62baf3');
		},
		onMouseLeave: () => {
			setOpacity(1);
			setBorder('none');
		},
		onMouseDown: () => {
			// if (parentPage === PageString.Showcase) setFill('transparent');
			// else layer.id === selectedLayerId ? setFill('rgba(75, 154, 244, 1)') : setFill('2');
		},
		onMouseUp: () => {
			// if (parentPage === PageString.Showcase) setFill('transparent');
			// else layer.id === selectedLayerId ? setFill('rgba(75, 154, 244, .7)') : setFill('1');
		},
		onClick: () => {
			// if (layer.id !== selectedLayerId) {
			// 	//처음으로 누른 경우 (선택)
			// 	setSelectedLayerId(layer.id);
			// } else {
			// 	//이미 눌린 상태인데 한번 더 누른 경우 (해제)
			// 	setSelectedLayerId(null);
			// }
		},
	};

	return (
		<FloatingBox {...innnerProps}>
			{layer.children &&
				layer.children.map((child: Layer, index: number) => {
					return <ToComponent key={index} layer={child} parentPage={parentPage} />;
				})}
		</FloatingBox>
	);
};

const ToComponentReal = <T extends React.ComponentType<any>>(props: {
	layer: Layer;
	component: T;
	parentPage: string;
}) => {
	const { layer, component: Component, parentPage } = props;

	const divStyle = {
		border: parentPage === 'Components' ? '1px solid grey' : 'none',
	};

	return (
		<div style={{ ...divStyle }}>
			<Component {...JSON.parse(JSON.stringify(layer.props))} />
		</div>
	);
};

const ToComponent = (props: { layer: Layer; parentPage?: string }) => {
	const { layer, parentPage = 'Showcase' } = props;

	if (layer.type === 'FloatingBox') {
		return <ToFloatingBox layer={layer} parentPage={parentPage} />;
	} else if (isAvailableComp(layer.type)) {
		return <ToComponentReal layer={layer} component={Moaui[layer.type]} parentPage={parentPage} />;
	} else {
		console.error('Unknown Layer Type:', layer.type);
		return null;
	}
};

export default ToComponent;
