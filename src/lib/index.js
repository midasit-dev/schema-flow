import React from 'react';
import ReactFlowComp from './Components/ReactFlowComp';
import { Svglist, Svgminimize } from './SVGComps';
import { motion, AnimatePresence } from 'framer-motion';

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
];

function App() {
	const [isopenList, setIsopenList] = React.useState(false);

	const toggleOpen = () => setIsopenList(!isopenList);

	return (
		<div className='App' style={{ width: '100vw', height: '100vh' }}>
			<div>
				<motion.div
					initial={{ width: '24px', height: '24px' }}
					animate={{ width: isopenList ? '14px' : '24px', height: isopenList ? '14px' : '24px' }}
					exit={{ width: '24px', height: '24px' }}
					transition={{ duration: 0.2 }}
					style={{
						// width: isopenList ? "12px" : "24px",
						// height: isopenList ? "12px" : "24px",
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

				<AnimatePresence mode={'wait'}>
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
									onClick={() => {
										setIsopenList(false);
									}}
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
