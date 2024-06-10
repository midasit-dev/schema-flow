import React from 'react';
import ReactFlowComp from './Components/ReactFlowComp';
import { Svglist, Svgminimize } from './SVGComps';
import { motion, AnimatePresence } from 'framer-motion';
import { useSetRecoilState } from 'recoil';
import { SelectedSchema } from './RecoilAtom/recoilState';
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
];

const exampleSchema = {
	canvas_1: {
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

function App() {
	const [isopenList, setIsopenList] = React.useState(false);
	const setSchema = useSetRecoilState(SelectedSchema);

	const toggleOpen = () => setIsopenList(!isopenList);

	function onClickPyHandler(e) {
		console.log('e:', e.target.innerText);
		// temp code
		if (e.target.innerText === 'text_to_plate_mesh') {
			setSchema(exampleSchema);
		}
	}

	React.useEffect(() => {
		setSchema(exampleSchema);
	}, []);

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
								<div
									key={index}
									style={{
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'flex-start',
										padding: '5px',
										cursor: 'pointer',
										borderBottom: index !== examplePylist.length - 1 ? '1px solid #c1c1c3' : 'none',
									}}
									onClick={onClickPyHandler}
								>
									<img
										style={{
											width: '14px',
											height: '14px',
											marginRight: '5px',
											marginTop: '5px',
										}}
										src={`${process.env.PUBLIC_URL}/svg/Python.svg`}
										alt='Python'
									/>
									{py}
								</div>
							))}
						</motion.div>
					)}
				</AnimatePresence>
			</div>
			<ReactFlowComp />
		</div>
	);
}

export default App;
