import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import ToComponent from './moaUI/ToComponent';
import { Canvas, Canvases, Layer } from '../Common/types';
import { SvgClose, SvgRightArrow, SvgLeftArrow } from '../SVGComps/index';
import RJSFComp from './rjsf';
import InfiniLoading from '../Components/Loading/InfinitLoading';

import { isEmpty } from 'lodash';

import JsonView from 'react18-json-view';
import 'react18-json-view/src/style.css';

import { motion, AnimatePresence, useAnimation } from 'framer-motion';

import ThreeDPM from '../Components/OutputComp/ThreeDPM';
import { useReactFlow } from 'reactflow';
// recoil
import { useSetRecoilState, useRecoilState } from 'recoil';
import { FunctionListInfo, ExecuteState } from '../RecoilAtom/recoilState';

const maxRJSFWidth = 620;
const minRJSFWidth = 400;
const maxWidth = 1200;
const maxHeight = 620;

export default function SchemaToUI(props: {
	nodeId: string;
	schemaInfo: any;
	setIsShake: any;
	input: any;
}) {
	const { nodeId, schemaInfo, setIsShake, input } = props;
	const [canvas, setCanvas] = React.useState<Canvas>({
		width: 300,
		height: 300,
		layers: [],
	});
	const [response, setResponse] = React.useState({});
	const [isOpenJsonView, setIsOpenJsonView] = React.useState(false);
	const [isloading, setIsloading] = React.useState(false);
	const uuid = React.useMemo(() => uuidv4().slice(0, 8), []);
	const [is3dpm, setIs3dpm] = React.useState(false);
	const [schema, setSchema] = React.useState(schemaInfo.schema);
	const [isSuccess, setIsSuccess] = React.useState(false);
	const [isError, setIsError] = React.useState(false);
	const setFunctionListInfo = useSetRecoilState(FunctionListInfo);
	const [executeState, setExecuteState] = useRecoilState(ExecuteState);

	const controls = useAnimation();
	const reactFlow = useReactFlow();

	React.useEffect(() => {
		setExecuteState((prev: any) => {
			// prev example
			// {
			// 	"nodeId": {
			// 		'setExecute': setExecute,
			// 		'setIsOpenJsonView': setIsOpenJsonView,
			// 		'setIsSuccess': setIsSuccess,
			// 		'setIsError': setIsError
			// 	}
			// };
			return {
				...prev,
				[nodeId]: {
					...prev[nodeId],
					setIsOpenJsonView,
					setIsSuccess,
					setIsError,
					setIsShake,
				},
			};
		});
	}, []);

	React.useEffect(() => {
		if (isSuccess) {
			controls.start({
				backgroundColor: [
					'rgba(0, 0, 0, 0.7)',
					'#15400e',
					'#14540d',
					'#0f6a08',
					'#008000',
					'#109010',
					'#008000',
				],
				transition: { duration: 1, ease: 'easeInOut', repeat: 1 },
			});
		} else if (isError) {
			controls.start({
				backgroundColor: [
					'rgba(0, 0, 0, 0.7)',
					'#52170b',
					'#7a1b0c',
					'#a51b0b',
					'#d11507',
					'#ff0000',
				],
				transition: { duration: 1, ease: 'easeInOut', repeat: 1 },
			});
		} else if (!isSuccess && !isError) {
			controls.start({
				backgroundColor: ['rgba(0, 0, 0, 0.7)'],
				transition: { duration: 1, ease: 'easeInOut', repeat: 2 },
			});
		}
	}, [isSuccess, isError]);

	const removeCustomNode = React.useCallback(
		(nodeId: string, functionId: string) => {
			console.log('removeCustomNode', nodeId, functionId);
			reactFlow.setNodes((nds) => {
				const nodes = nds.filter((node) => node.id !== nodeId);
				const localFlow = JSON.parse(localStorage.getItem('FLOW') || '{}');
				localStorage.setItem('FLOW', JSON.stringify({ ...localFlow, nodes: nodes }));
				return nodes;
			});
			reactFlow.setEdges((eds) => {
				const edges = eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId);
				const localFlow = JSON.parse(localStorage.getItem('FLOW') || '{}');
				localStorage.setItem('FLOW', JSON.stringify({ ...localFlow, edges: edges }));
				return edges;
			});
			setFunctionListInfo((prev: any) => {
				const updateitems = prev[schemaInfo.category].map((item: any) => {
					if (item.id === functionId) {
						const viewCount = item.viewCount - 1;
						return { ...item, isRendered: viewCount > 0 ? true : false, viewCount: viewCount };
					} else return item;
				});
				return { ...prev, [schemaInfo.category]: updateitems };
			});
		},
		[reactFlow, setFunctionListInfo],
	);

	React.useEffect(() => {
		if (schemaInfo.schema.canvas === undefined) return;
		setCanvas(schemaInfo.schema.canvas);
	}, [schemaInfo]);

	const onClickCloseHandler = React.useCallback(() => {
		removeCustomNode(nodeId, schemaInfo.id);
	}, [nodeId, schemaInfo.id, removeCustomNode]);

	const onClickOpenJsonView = React.useCallback(() => {
		setIsOpenJsonView(!isOpenJsonView);
	}, [isOpenJsonView]);

	const setResponseData = React.useCallback((data: any) => {
		if (!isEmpty(data) && data.hasOwnProperty('json')) {
			data = data.json;
			if (data.hasOwnProperty('moapy.project.wgsd.wgsd_flow.Result3DPM')) {
				const mesh3dpm = data['moapy.project.wgsd.wgsd_flow.Result3DPM'].meshes.mesh3dpm;
				const strength = data['moapy.project.wgsd.wgsd_flow.Result3DPM'].strength;
				const lcbs = data['moapy.project.wgsd.wgsd_flow.Result3DPM'].lcbs;
				setIs3dpm(true);
				setIsOpenJsonView(false);
				setResponse({ mesh3dpm, strength, lcbs });
			} else {
				setIs3dpm(false);
				setIsOpenJsonView(true);
				setResponse(data);
			}
		}
	}, []);

	function isSuccessFunctionExecute(result: boolean) {
		if (result) {
			setIsSuccess(true);

			// showSuccessSnackbar("Function executed successfully.");
		} else {
			setIsError(true);

			// showErrorSnackbar("Function execution failed.");
		}
	}

	return (
		<div>
			{/* canvases is object */}
			<motion.div
				animate={controls}
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
				{schemaInfo.schema.title} {isSuccess ? '- Success' : isError ? '- Error' : ''}
				<div
					className='btnClose'
					style={{
						width: '20px',
						height: '20px',
						cursor: 'pointer',
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						borderRadius: '50%',
						backgroundColor: 'transparent',
					}}
					onClick={onClickCloseHandler}
				>
					<SvgClose />
				</div>
				<style>
					{`
						.btnClose:hover {
							background-color: gray !important;
						}
					`}
				</style>
			</motion.div>

			{isloading && <InfiniLoading />}
			<div
				style={{ display: 'flex', flexDirection: 'row', maxWidth: maxWidth }}
				className='nodrag nowheel'
			>
				<div
					key={`PanelCanvas-${uuid}`}
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
						schema={schema}
						input={input}
						executeURI={schemaInfo.executeURI}
						setResponseData={setResponseData}
						setIsloading={setIsloading}
						isSuccessFunctionExecute={isSuccessFunctionExecute}
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
					<>
						{is3dpm ? (
							<div
								style={{
									width: '100%',
									height: maxHeight,
									overflow: 'auto',
									backgroundColor: 'white',
								}}
							>
								<ThreeDPM data={response} />
							</div>
						) : (
							<JsonView
								src={response}
								style={{ width: '100%', height: maxHeight, overflow: 'auto', paddingRight: '30px' }}
							/>
						)}
					</>
				)}
			</div>
		</div>
	);
}
