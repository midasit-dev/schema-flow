import React from 'react';
import { Panel } from '@midasit-dev/moaui';
import { v4 as uuidv4 } from 'uuid';
import ToComponent from './moaUI/ToComponent';
import { Canvas, Canvases, Layer } from '../Common/types';
import { SvgClose, SvgRightArrow, SvgLeftArrow } from '../SVGComps/index';
import RJSFComp from './rjsf';
import InfiniLoading from '../Components/Loading/InfinitLoading';

import { isEmpty, set } from 'lodash';

import JsonView from 'react18-json-view';
import 'react18-json-view/src/style.css';

import { useSnackbar } from 'notistack';
import { motion, AnimatePresence } from 'framer-motion';

import ThreeDPM from '../Components/ThreeDPM';
import { useReactFlow } from 'reactflow';
// recoil
import { useSetRecoilState } from 'recoil';
import { FunctionListInfo } from '../RecoilAtom/recoilState';

const maxRJSFWidth = 620;
const minRJSFWidth = 350;
const maxWidth = 1000;
const maxHeight = 620;

const nodesLengthSelector = (state: any) => Array.from(state.nodeInternals.values()) || 0;

export default function SchemaToUI(props: {
	nodeId: string;
	schemaInfo: any;
}) {
	const { nodeId, schemaInfo } = props;
	const [bgColor, setBgColor] = React.useState('transparent');
	const [canvas, setCanvas] = React.useState<Canvas>({
		width: 300,
		height: 300,
		layers: [],
	});
	const [response, setResponse] = React.useState({});
	const [isOpenJsonView, setIsOpenJsonView] = React.useState(false);
	const [isloading, setIsloading] = React.useState(false);

	const [is3dpm, setIs3dpm] = React.useState(false);
	const setFunctionListInfo = useSetRecoilState(FunctionListInfo);

	const { enqueueSnackbar, closeSnackbar } = useSnackbar();

	const reactFlow = useReactFlow();

	const removeCustomNode = React.useCallback(
		(nodeId: string, functionId: string) => {
			console.log('removeCustomNode', nodeId, functionId);
			reactFlow.setNodes((nds) => {
				const nodes = nds.filter((node) => node.id !== nodeId);
				const localFlow = JSON.parse(localStorage.getItem('FLOW') || '{}');
				localStorage.setItem('FLOW', JSON.stringify({...localFlow, "nodes": nodes}));
				return nodes;
			});
			reactFlow.setEdges((eds) => {
				const edges =	eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId)
				const localFlow = JSON.parse(localStorage.getItem('FLOW') || '{}');
				localStorage.setItem('FLOW', JSON.stringify({...localFlow, "edges":edges}));
				return edges;
			}
			);
			setFunctionListInfo((prev: any) => {
				return prev.map((item: any) => {
					if (item.id === functionId) {
						const viewCount = item.viewCount - 1;
						return { ...item, isRendered: viewCount > 0 ? true : false, viewCount: viewCount };
					} else return item;
				});
			});
		},
		[reactFlow, setFunctionListInfo],
	);

	// const action = (key) => (
	//   <Button sx={{m:0, p:0}} onClick={() => closeSnackbar(key)}>
	//     <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
	//       <path d="M0.759766 0.76001L9.24505 9.24529" stroke="#D5D9DE" strokeLinecap="round"/>
	//       <path d="M9.24512 0.76001L0.759836 9.24529" stroke="#D5D9DE" strokeLinecap="round"/>
	//     </svg>
	//   </Button>
	// );

	// function showSuccessSnackbar(msg){
	//   enqueueSnackbar(msg, {
	//     variant: "customSuccess",
	//     anchorOrigin: {
	//       vertical: 'bottom',
	//       horizontal: 'center',
	//     },
	//     action,
	//     marginBottom: "2.5rem",
	//   });
	// }

	// function showErrorSnackbar(msg){
	//   enqueueSnackbar(msg, {
	//     variant: "customError",
	//     anchorOrigin: {
	//       vertical: 'bottom',
	//       horizontal: 'center',
	//     },
	//     action,
	//     marginBottom: "2.5rem",
	//   });
	// }

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
		removeCustomNode(nodeId, schemaInfo.id);
	}, [nodeId, schemaInfo.id, removeCustomNode]);

	function onClickOpenJsonView() {
		setIsOpenJsonView(!isOpenJsonView);
	}

	function setResponseData(data: any) {
		if (data.hasOwnProperty('json')) {
			data = data.json;
			if (data.hasOwnProperty('PM_Curve')) {
				data = data.PM_Curve.DATA;
				setIs3dpm(true);
				setIsOpenJsonView(false);
			} else {
				setIs3dpm(false);
				setIsOpenJsonView(true);
			}
		}
		setResponse(data);
	}

	return (
		<div>
			{/* canvases is object */}
			<div
				style={{
					width: '100%',
					height: 26,
					maxWidth: maxWidth,
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
				{schemaInfo.schema.title}
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

			{isloading && <InfiniLoading />}
			<div
				style={{ display: 'flex', flexDirection: 'row', maxWidth: maxWidth }}
				className='nodrag nowheel'
			>
				<div
					key={'PanelCanvas-' + uuidv4().slice(0, 8)}
					style={{
						width: isOpenJsonView ? '60%' : '100%',
						height: '100%',
						maxWidth: maxRJSFWidth,
						maxHeight: maxHeight,
						minWidth: minRJSFWidth,
						overflow: 'auto',
						borderLeft: '1px solid #c1c1c3',
						borderRight: '1px solid #c1c1c3',
						borderBottom: '1px solid #c1c1c3',
						backgroundColor: 'rgba(255, 255, 255, 0.9)',
						position: 'relative',
						padding: '10px',
					}}
				>
					{/* {canvas.layers.map((layer: Layer, index: number) => {
					return <ToComponent key={index} layer={layer} />;
				})} */}
					<RJSFComp
						nodeId={nodeId}
						schema={schemaInfo.schema}
						path={schemaInfo.path}
						enqueueSnackbar={enqueueSnackbar}
						setResponseData={setResponseData}
						setIsloading={setIsloading}
					/>
					{!isEmpty(response) && (
						<div
							style={{
								position: 'fixed',
								top: '52%',
								right: -10,
								width: '25px',
								height: '25px',
								borderRadius: '46%',
								backgroundColor: '#595fe0',
								cursor: 'pointer',
								zIndex: 100,
							}}
							onClick={onClickOpenJsonView}
						>
							<AnimatePresence mode={'wait'}>
								{isOpenJsonView || is3dpm ? <SvgLeftArrow /> : <SvgRightArrow />}
							</AnimatePresence>
						</div>
					)}
				</div>
				{isOpenJsonView && (
					<JsonView
						src={response}
						style={{ width: '100%', height: maxHeight, overflow: 'auto', paddingRight: '30px' }}
					/>
				)}
				{is3dpm && (
					<div
						style={{ width: '100%', height: maxHeight, overflow: 'auto', backgroundColor: 'white' }}
					>
						<ThreeDPM data={response} />
					</div>
				)}
			</div>
		</div>
	);
}
