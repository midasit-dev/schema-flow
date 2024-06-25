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
	console.log('data', data);
	return data;
};

function App() {
	const [isopenList, setIsopenList] = React.useState(false);
	const [functionlistInfo, setFunctionListInfo] = useRecoilState(FunctionListInfo);
	const setSchema = useSetRecoilState(SelectedSchema);

	const toggleOpen = () => setIsopenList(!isopenList);

	React.useEffect(() => {
		async function fetchFunctionList() {
			const functionlist = await getFunctionList();
			let newFunctionListInfo = [];
			if(functionlist.length === 0) return;
			for (let i = 0; i < functionlist.length; i++) {
				let name = functionlist[i].split('/').pop();
				if (name === 'base' || name === 'project') continue;
				// change '_' to ' '
				name = name.replace(/_/g, ' ');
				name = name.charAt(0).toUpperCase() + name.slice(1);
				newFunctionListInfo.push({
					id: 'Custom_' + i,
					name: name,
					schema: {},
					isSelected: false,
					isRendered: false,
					viewCount: 0,
					path: functionlist[i],
				});
			}
			console.log('newFunctionListInfo', newFunctionListInfo);
			setFunctionListInfo(newFunctionListInfo);
		}
		fetchFunctionList();
	}, []);

	const handleSetSelectFunctionListInfo = React.useCallback(
		(index, isSelected, schema) => {
			setFunctionListInfo((prev) => {
				return prev.map((item, idx) => {
					if (idx !== index) {
						// 현재 아이템이 선택 대상이 아닌 경우, isSelected가 true일 때만 false로 설정
						return isSelected ? { ...item, isSelected: false } : item;
					}
					// 선택된 아이템에 대해 isSelected 상태와 선택된 경우 schema 업데이트
					return {
						...item,
						isSelected,
						...(isSelected && { schema }), // isSelected가 true일 경우에만 schema 추가
					};
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
