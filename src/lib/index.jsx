import React from 'react';
import ReactFlowComp from './Components/ReactFlowComp';
import { Svglist, Svgminimize } from './SVGComps';
import { motion, AnimatePresence } from 'framer-motion';
import { useSetRecoilState, useRecoilState } from 'recoil';
import { SelectedSchema, FunctionListInfo } from './RecoilAtom/recoilState';
import { ReactFlowProvider } from 'reactflow';
import ListComp from './Components/ListComp';

const getFunctionList = async () => {
	const res = await fetch(`${process.env.REACT_APP_API_URL}backend/wgsd/functions`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
		},
	});
	const data = await res.json();
	return data;
};

// JSON 데이터에서 $ref를 해제하는 함수
const dereference = (json) => {
	const resolveRef = (ref, root) => {
		const parts = ref.split('/').slice(1); // 첫 번째 요소는 "#"이므로 제거
		let result = root;
		for (const part of parts) {
			result = result[part];
		}
		return result;
	};

	const traverse = (obj, root) => {
		if (Array.isArray(obj)) {
			return obj.map((item) => traverse(item, root));
		} else if (obj !== null && typeof obj === 'object') {
			if (obj.$ref) {
				return traverse(resolveRef(obj.$ref, root), root);
			}
			return Object.keys(obj).reduce((acc, key) => {
				acc[key] = traverse(obj[key], root);
				return acc;
			}, {});
		}
		return obj;
	};

	return traverse(json, json);
};

function App() {
	const [isopenList, setIsopenList] = React.useState(false);
	const [functionlistInfo, setFunctionListInfo] = useRecoilState(FunctionListInfo);
	const setSchema = useSetRecoilState(SelectedSchema);

	const toggleOpen = () => setIsopenList(!isopenList);

	React.useEffect(() => {
		async function fetchFunctionList() {
			const functionlist = await getFunctionList();
			const newFunctionListInfo = functionlist.map((item, index) => {
				const dereferencedFunctionList = dereference(item);
				let schema = {};
				let name = '';
				let path = '';
				const paths = dereferencedFunctionList.paths;
				for (const key in paths) {
					// ex) key is '/moapy/project/wgsd/wgsd_flow/calc_3dpm'
					// name is 'calc_3dpm'
					path = key;
					name = key.split('/').pop();
					schema = paths[key]['post']['requestBody']['content']['application/json']['schema'];
				}
				return {
					id: index,
					name: name,
					schema: schema,
					isSelected: false,
					isRendered: false,
					viewCount: 0,
					path: path,
				};
			});
			console.log('newFunctionListInfo', newFunctionListInfo);
			setFunctionListInfo(newFunctionListInfo);
		}
		fetchFunctionList();
	}, []);

	const handleSetSelectFunctionListInfo = React.useCallback(
		(index, isSelected) => {
			setFunctionListInfo((prev) => {
				return prev.map((item, idx) => {
					if (idx === index) {
						return { ...item, isSelected: isSelected };
					} else {
						if (isSelected) return { ...item, isSelected: false };
						else return item;
					}
				});
			});
		},
		[setFunctionListInfo],
	);

	const handleChangeSchema = React.useCallback(
		(schemainfo) => {
			setSchema(schemainfo);
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
						boxSizing: 'content-box',
						WebkitBoxSizing: 'content-box',
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
							{functionlistInfo.map((py, index) => (
								<ListComp
									key={'listcomp_' + index}
									py={py.name}
									index={index}
									item={functionlistInfo[index]}
									onChangeSchema={handleChangeSchema}
									onSetFunctionListInfo={handleSetSelectFunctionListInfo}
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
