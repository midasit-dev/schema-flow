import React from 'react';
import ReactFlowComp from './Components/ReactFlowComp';
import { Svglist, Svgminimize } from './SVGComps';
import { motion, AnimatePresence } from 'framer-motion';
import { useSetRecoilState, useRecoilState } from 'recoil';
import { SelectedSchema, isClickedlist } from './RecoilAtom/recoilState';
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

function App() {
	const [isopenList, setIsopenList] = React.useState(false);
	const [isClicked, setIsClicked] = useRecoilState(isClickedlist);
	const setSchema = useSetRecoilState(SelectedSchema);

	const toggleOpen = () => setIsopenList(!isopenList);

	React.useEffect(() => {
		// make array of false by examplePylist
		setIsClicked(new Array(examplePylist.length).fill(false));
	}, []);

	function ListComp(props) {
		const { py, index } = props;

		function onClickPyHandler(e) {
			if (isClicked[index]) {
				const newIsClicked = new Array(examplePylist.length).fill(false);
				setIsClicked(newIsClicked);
				setSchema({});
				return;
			}

			const newIsClicked = new Array(examplePylist.length).fill(false);
			newIsClicked[index] = true;
			setIsClicked(newIsClicked);

			// temp code
			if (e.target.innerText === 'text_to_plate_mesh') {
				setSchema(exampleSchema);
			} else if (e.target.innerText === 'text_to_plate_mesh2') {
				setSchema(exampleSchema2);
			}
		}

		const variants = {
			hidden: { opacity: 1 },
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
				transition: { repeat: Infinity, duration: 1.5, ease: 'linear' },
			},
		};

		return (
			<motion.div
				key={'listbutton_' + index}
				initial='hidden'
				animate={isClicked[index] ? 'visible' : 'hidden'}
				variants={variants}
				style={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'flex-start',
					cursor: 'pointer',
					borderRadius: isClicked[index] ? '5px' : '0px',
					borderBottom: index !== examplePylist.length - 1 ? '1px solid #c1c1c3' : 'none',
					backgroundImage: isClicked[index]
						? 'linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)'
						: 'none',
					backgroundSize: '400% 400%',
				}}
				onClick={onClickPyHandler}
			>
				<div
					key={'listname_' + index}
					style={{
						padding: '5px',
					}}
				>
					{py}
				</div>
			</motion.div>
		);
	}

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
								<ListComp key={'listcomp_' + index} py={py} index={index} />
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
