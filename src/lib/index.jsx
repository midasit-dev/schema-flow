import React from 'react';
import ReactFlowComp from './Components/ReactFlowComp';
import { Svglist, Svgminimize, SvgCheckCircle } from './SVGComps';
import { motion, AnimatePresence, m } from 'framer-motion';
import { useSetRecoilState, useRecoilState } from 'recoil';
import { SelectedSchema, FunctionListInfo } from './RecoilAtom/recoilState';
import { ReactFlowProvider } from 'reactflow';

const examplePylist = [
	'create-alignment-moaui',
	'baseplate-moaui',
	'concrete-material-set-eurocode-moaui',
	'convert-load-combinations-into-sds-format-moaui',
	'extrude_offset',
	'flared-pier-moaui',
	'group-pile-creator-moaui',
	'inertial-forces-controller-moaui',
	'lcom-generator-moaui',
	'linkprojection-moaui',
	'local_axis-moaui',
	'pile-spring-moaui',
	'response-spectrum-generator-moaui',
	'series-load-moaui',
	'steel-girder-table',
	'temperature-gradient-stress-calculator-moaui',
	'tendon-profile-converter-moaui',
	'texdas',
	'text_to_plate_mesh',
	'text_to_plate_mesh2',
];

const exampleSchema = {
	canvas: {
		width: 640,
		height: 320,
		layers: [
			{
				id: '1-FloatingBox',
				type: 'FloatingBox',
				props: {
					x: 0,
					y: 0,
					width: 640,
					height: 64,
					guideBoxProps: {
						width: 'inherit',
						height: 'inherit',
						id: '1-FloatingBox',
						spacing: 1,
						center: true,
					},
				},
				children: [
					{
						id: '1-Typography',
						type: 'Typography',
						props: {
							children: 'text_to_plate_mesh',
							width: 'auto',
							height: 'auto',
							variant: 'h1',
							color: 'primary',
							size: 'large',
						},
						children: [],
					},
					{
						id: '2-Typography',
						type: 'Typography',
						props: {
							children:
								'Convert the text to a plate mesh and upload the image as a triangular mesh to MIDAS CIVIL.',
							width: 'auto',
							height: 'auto',
							variant: 'body1',
							color: 'primary',
							size: 'small',
						},
						children: [],
					},
				],
				parent: null,
			},
			{
				id: '2-FloatingBox',
				type: 'FloatingBox',
				props: {
					x: 0,
					y: 64,
					width: 640,
					height: 64,
					guideBoxProps: {
						width: 'inherit',
						height: 'inherit',
						id: '2-FloatingBox',
						spacing: 1,
						center: true,
					},
				},
				children: [
					{
						id: '2-TextField',
						type: 'TextField',
						props: {
							title: 'text',
							placeholder: 'Placeholder',
							wrappedWidth: '200px',
							width: '150px',
							height: '30px',
						},
						children: [],
					},
				],
				parent: null,
			},
			{
				id: '3-FloatingBox',
				type: 'FloatingBox',
				props: {
					x: 0,
					y: 128,
					width: 640,
					height: 64,
					guideBoxProps: {
						width: 'inherit',
						height: 'inherit',
						id: '3-FloatingBox',
						spacing: 1,
						center: true,
					},
				},
				children: [
					{
						id: '3-TextField',
						type: 'TextField',
						props: {
							title: 'insert',
							placeholder: 'Placeholder',
							wrappedWidth: '200px',
							width: '150px',
							height: '30px',
						},
						children: [],
					},
				],
				parent: null,
			},
			{
				id: '4-FloatingBox',
				type: 'FloatingBox',
				props: {
					x: 0,
					y: 192,
					width: 640,
					height: 64,
					guideBoxProps: {
						width: 'inherit',
						height: 'inherit',
						id: '4-FloatingBox',
						spacing: 1,
						center: true,
					},
				},
				children: [
					{
						id: '4-TextField',
						type: 'TextField',
						props: {
							title: 'height',
							placeholder: 'Placeholder',
							wrappedWidth: '200px',
							width: '150px',
							height: '30px',
						},
						children: [],
					},
				],
				parent: null,
			},
			{
				id: '6-FloatingBox',
				type: 'FloatingBox',
				props: {
					x: 0,
					y: 256,
					width: 640,
					height: 64,
					guideBoxProps: {
						width: 'inherit',
						height: 'inherit',
						id: '6-FloatingBox',
						spacing: 1,
						center: true,
					},
				},
				children: [
					{
						id: '6-Button',
						type: 'Button',
						props: {
							children: '실행하기',
							width: '100px',
							variant: 'contained',
							color: 'negative',
						},
						children: [],
					},
				],
				parent: null,
			},
		],
	},
};

const exampleSchema2 = {
	canvas: {
		width: 640,
		height: 256,
		layers: [
			{
				id: '1-FloatingBox',
				type: 'FloatingBox',
				props: {
					x: 0,
					y: 0,
					width: 640,
					height: 64,
					guideBoxProps: {
						width: 'inherit',
						height: 'inherit',
						id: '1-FloatingBox',
						spacing: 1,
						center: true,
					},
				},
				children: [
					{
						id: '1-Typography',
						type: 'Typography',
						props: {
							children: 'text_to_plate_mesh',
							width: 'auto',
							height: 'auto',
							variant: 'h1',
							color: 'primary',
							size: 'large',
						},
						children: [],
					},
					{
						id: '2-Typography',
						type: 'Typography',
						props: {
							children:
								'Convert the text to a plate mesh and upload the image as a triangular mesh to MIDAS CIVIL.',
							width: 'auto',
							height: 'auto',
							variant: 'body1',
							color: 'primary',
							size: 'small',
						},
						children: [],
					},
				],
				parent: null,
			},
			{
				id: '2-FloatingBox',
				type: 'FloatingBox',
				props: {
					x: 0,
					y: 64,
					width: 640,
					height: 64,
					guideBoxProps: {
						width: 'inherit',
						height: 'inherit',
						id: '2-FloatingBox',
						spacing: 1,
						center: true,
					},
				},
				children: [
					{
						id: '2-TextField',
						type: 'TextField',
						props: {
							title: 'text',
							placeholder: 'Placeholder',
							wrappedWidth: '200px',
							width: '150px',
							height: '30px',
						},
						children: [],
					},
				],
				parent: null,
			},
			{
				id: '3-FloatingBox',
				type: 'FloatingBox',
				props: {
					x: 0,
					y: 128,
					width: 640,
					height: 64,
					guideBoxProps: {
						width: 'inherit',
						height: 'inherit',
						id: '3-FloatingBox',
						spacing: 1,
						center: true,
					},
				},
				children: [
					{
						id: '3-TextField',
						type: 'TextField',
						props: {
							title: 'insert',
							placeholder: 'Placeholder',
							wrappedWidth: '200px',
							width: '150px',
							height: '30px',
						},
						children: [],
					},
				],
				parent: null,
			},
			{
				id: '4-FloatingBox',
				type: 'FloatingBox',
				props: {
					x: 0,
					y: 192,
					width: 640,
					height: 64,
					guideBoxProps: {
						width: 'inherit',
						height: 'inherit',
						id: '4-FloatingBox',
						spacing: 1,
						center: true,
					},
				},
				children: [
					{
						id: '4-TextField',
						type: 'TextField',
						props: {
							title: 'height',
							placeholder: 'Placeholder',
							wrappedWidth: '200px',
							width: '150px',
							height: '30px',
						},
						children: [],
					},
				],
				parent: null,
			},
		],
	},
};

const getSchema = async () => {
	const res = await fetch(`${process.env.PUBLIC_URL}/backend/wgsd/function-list`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
		},
	})
		.then((res) => res.json())
		.then((data) => {
			console.log(data);
		});
	// console.log("res", res);
};

const ListComp = (props) => {
	const { py, index, item, onChangeSchema, onSetFunctionListInfo } = props;

	React.useEffect(() => {
		getSchema();
	}, []);

	function onClickPyHandler(e) {
		// if function is already selected, then unselect it.
		if (item.isSelected) {
			onSetFunctionListInfo(index, false);
			onChangeSchema({});
			return;
		}

		// if function is not selected, then select it.
		onSetFunctionListInfo(index, true);

		// temp code will remove later after functionlist post api integration.
		if (e.target.innerText === 'text_to_plate_mesh') {
			onChangeSchema(exampleSchema);
		} else if (e.target.innerText === 'text_to_plate_mesh2') {
			onChangeSchema(exampleSchema2);
		}
	}

	const ty = React.useMemo(() => 48, []);
	const tx = React.useMemo(() => -2.5, []);
	const variants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			backgroundPosition: [
				'0% 25%',
				'25% 50%',
				'50% 100%',
				'100% 50%',
				'50% 25%',
				'25% 0%',
				'0% 25%',
			],
			transition: { duration: 0.5, ease: 'linear' },
		},
		move: {
			transform: [`translate(0%, -${ty}%)`, `translate(-50%, -${ty}%)`],
			transition: { repeat: Infinity, repeatType: 'reverse', duration: 0.8 },
		},
		shrink: {
			// x: [null, 'calc(100% - 16px)'], // x 좌표는 계산된 위치로 이동
			transform: [null, ``, `translateY(-${ty}%) scale(1)`, `translate(${tx}%, -${ty}%) scale(0)`], // 크기를 0으로 줄임
			// opacity: [1, 0], // 불투명에서 투명으로
			transition: { duration: 1.2, ease: 'easeInOut' }, // 부드럽게 변화
		},
	};

	return (
		<motion.div
			key={'list_button_' + index}
			style={{
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'flex-start',
				cursor: 'pointer',
				width: '100%',
				height: '100%',
				borderRadius: '5px',
				borderBottom: index !== examplePylist.length - 1 ? '1px solid #c1c1c3' : 'none',
				position: 'relative',
				overflow: 'hidden', // 자식 요소가 부모 요소 밖으로 넘치지 않도록
			}}
			onClick={onClickPyHandler}
		>
			{/* 배경 애니메이션을 위한 motion.div */}
			<AnimatePresence mode='popLayout'>
				{item.isSelected && (
					<motion.div
						key={'list_background_' + index}
						initial='hidden'
						animate='visible'
						variants={variants}
						style={{
							position: 'absolute',
							top: 0,
							left: 0,
							width: '100%',
							height: '100%',
							overflow: 'hidden',
							containerType: 'inline-size',
						}}
					>
						<motion.div
							whileInView='move'
							exit='shrink'
							variants={variants}
							style={{
								position: 'absolute',
								width: '200cqw',
								height: '200cqw',
								clipPath: 'circle(farthest-side)',
								background: 'linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)',
							}}
						/>
					</motion.div>
				)}
			</AnimatePresence>
			<div
				key={'listname_' + index}
				style={{
					padding: '5px',
					width: '100%',
					height: '100%',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					zIndex: '1000',
				}}
			>
				{py}
				<div style={{ width: '20px', height: '20px', marginRight: '5px' }}>
					<SvgCheckCircle color={item.isSelected ? 'white' : 'black'} isVisible={item.isRendered} />
				</div>
			</div>
		</motion.div>
	);
};

function App() {
	const [isopenList, setIsopenList] = React.useState(false);
	const [functionlistInfo, setFunctionListInfo] = useRecoilState(FunctionListInfo);
	const setSchema = useSetRecoilState(SelectedSchema);

	const toggleOpen = () => setIsopenList(!isopenList);

	React.useEffect(() => {
		// make array by examplePylist.length and below object is reference
		// [
		// 	{
		// 		schema : {}
		// 		isSelected : false
		// 		isRendered : false
		// 		viewCount : 0
		// 	}
		// ]
		const newFunctionListInfo = new Array(examplePylist.length).fill({
			schema: {},
			isSelected: false,
			isRendered: false,
			viewCount: 0,
		});
		setFunctionListInfo(newFunctionListInfo);
	}, []);

	const handleSetFunctionListInfo = React.useCallback((index, isSelected) => {
		setFunctionListInfo((prev) => {
			return prev.map((item, idx) => {
				if (idx === index) {
					return { ...item, isSelected: isSelected };
				} else {
					return item;
				}
			});
		});
	});

	const handleChangeSchema = React.useCallback(
		(schema) => {
			setSchema(schema);
		},
		[setSchema],
	);

	return (
		<div className='App' style={{ width: '100vw', height: '100vh' }}>
			<div>
				<motion.div
					initial={{ width: '24px', height: '24px' }}
					animate={{ width: isopenList ? '14px' : '24px', height: isopenList ? '14px' : '24px' }}
					exit={{ width: '24px', height: '24px' }}
					transition={{ duration: 0.2 }}
					style={{
						backgroundColor: 'white',
						cursor: 'pointer',
						position: 'fixed',
						top: '5px',
						left: '5px',
						zIndex: '2000',
						padding: '10px',
						borderRadius: '50%',
						border: '1px solid #c1c1c3',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
					}}
					onClick={toggleOpen}
				>
					<AnimatePresence mode={'wait'}>
						{isopenList ? <Svgminimize key='minimize' /> : <Svglist key='list' />}
					</AnimatePresence>
				</motion.div>
				<AnimatePresence>
					{isopenList && (
						<motion.div
							key={'div_schema_list'}
							initial={{ opacity: 0, scale: 0, x: '-50%', y: '-50%' }}
							animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
							exit={{ opacity: 0, scale: 0, x: '-50%', y: '-50%' }}
							transition={{ duration: 0.2 }}
							style={{
								width: 'auto',
								height: 'auto',
								backgroundColor: 'rgba(252, 249, 235, 0.7)',
								cursor: 'pointer',
								position: 'absolute',
								top: '24px',
								left: '24px',
								zIndex: '1000',
								padding: '5px',
								border: '1px solid #c1c1c3',
								borderRadius: '8px',
							}}
						>
							{examplePylist.map((py, index) => (
								<ListComp
									key={'listcomp_' + index}
									py={py}
									index={index}
									item={functionlistInfo[index]}
									onChangeSchema={handleChangeSchema}
									onSetFunctionListInfo={handleSetFunctionListInfo}
								/>
							))}
						</motion.div>
					)}
				</AnimatePresence>
			</div>
			<ReactFlowProvider>
				<ReactFlowComp />
			</ReactFlowProvider>
		</div>
	);
}

export default App;
