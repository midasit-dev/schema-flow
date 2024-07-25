import React from 'react';
import ReactFlowComp from './Components/ReactFlowComp';
import { Svglist, Svgminimize } from './SVGComps';
import { motion, AnimatePresence } from 'framer-motion';
import { useSetRecoilState, useRecoilState } from 'recoil';
import { SelectedSchema, FunctionListInfo } from './RecoilAtom/recoilState';
import { ReactFlowProvider } from 'reactflow';
import ListComp from './Components/Functionlist/ListComp';
import SearchBar from './Components/Functionlist/Searchbar';
import Category from './Components/Functionlist/Category';
// import Test from './Components/Test';

const getFunctionListFromST = async () => {
	const res = await fetch(`${process.env.REACT_APP_ACTUAL_ST_API_URL}backend/wgsd/functions`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
		},
	});
	const data = await res.json();
	console.log('data st', data);
	return data;
};

const getFunctionListFromDV = async () => {
	const res = await fetch(`${process.env.REACT_APP_ACTUAL_DV_API_URL}backend/wgsd/functions`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
		},
	});
	const data = await res.json();
	console.log('data dv', data);
	return data;
};

function App() {
	const [isopenList, setIsopenList] = React.useState(false);
	const [searchTerm, setSearchTerm] = React.useState('');
	const [functionlistInfo, setFunctionListInfo] = useRecoilState(FunctionListInfo);
	const [originalDVFunctionListInfo, setOriginalDVFunctionListInfo] = React.useState([]);
	const [originalSTFunctionListInfo, setOriginalSTFunctionListInfo] = React.useState([]);
	const [selectedCategory, setSelectedCategory] = React.useState(null);

	const setSchema = useSetRecoilState(SelectedSchema);

	const toggleOpen = () => setIsopenList(!isopenList);

	const formatFunctionName = React.useCallback((name) => {
		name = name.replace(/_/g, ' ');
		return name.charAt(0).toUpperCase() + name.slice(1);
	}, []);

	const fetchSTFunctionList = React.useCallback(
		async (functionlistInfoLocal) => {
			const functionlist = await getFunctionListFromST();
			if (functionlist.length === 0) return;

			const newFunctionListInfo = functionlist.reduce((acc, path, i) => {
				const idx = path.indexOf('wgsd');
				let parentFolder = '';
				if (idx === -1) {
					parentFolder = 'plugin/' + path.split('/').pop();
				} else {
					parentFolder = path.slice(idx);
				}
				let name = path.split('/').pop();
				if (name === 'base' || name === 'project') return acc; // Consider removing this line if no longer needed

				name = formatFunctionName(name);
				const existingInfo = functionlistInfoLocal?.ST?.find((info) => info.name === name);
				const functionInfo = existingInfo
					? { ...existingInfo, id: `Custom_${i}_${name}`, path }
					: {
							id: `Custom_${i}_${name}`,
							name,
							schema: {},
							isSelected: false,
							isRendered: false,
							viewCount: 0,
							parentFolder: parentFolder,
							path,
					  };

				acc.push(functionInfo);
				return acc;
			}, []);
			setOriginalSTFunctionListInfo(newFunctionListInfo);
			return { ST: newFunctionListInfo };
		},
		[setOriginalSTFunctionListInfo, formatFunctionName],
	);

	const fetchDVFunctionList = React.useCallback(
		async (functionlistInfoLocal) => {
			const functionlist = await getFunctionListFromDV();
			if (functionlist.length === 0) return;

			const newFunctionListInfo = functionlist.reduce((acc, path, i) => {
				const idx = path.indexOf('wgsd');
				let parentFolder = '';
				if (idx === -1) {
					parentFolder = 'plugin/' + path.split('/').pop();
				} else {
					parentFolder = path.slice(idx);
				}
				let name = path.split('/').pop();
				if (name === 'base' || name === 'project') return acc; // Consider removing this line if no longer needed

				name = formatFunctionName(name);
				const existingInfo = functionlistInfoLocal?.DV?.find((info) => info.name === name);
				const functionInfo = existingInfo
					? { ...existingInfo, id: `Custom_${i}_${name}`, path }
					: {
							id: `Custom_${i}_${name}`,
							name,
							schema: {},
							isSelected: false,
							isRendered: false,
							viewCount: 0,
							parentFolder: parentFolder,
							path,
					  };

				acc.push(functionInfo);
				return acc;
			}, []);
			setOriginalDVFunctionListInfo(newFunctionListInfo);
			return { DV: newFunctionListInfo };
		},
		[setOriginalDVFunctionListInfo, formatFunctionName],
	);

	const loadData = React.useCallback(async () => {
		let functionlistInfo = [];
		const localFlow = localStorage.getItem('FLOW');
		const functionlistInfoLocal = localFlow ? JSON.parse(localFlow)['functionlistInfo'] : [];

		const resST = await fetchSTFunctionList(functionlistInfoLocal);
		const resDV = await fetchDVFunctionList(functionlistInfoLocal);
		functionlistInfo = { ...resST, ...resDV };
		setFunctionListInfo(functionlistInfo);
	}, [setFunctionListInfo, fetchSTFunctionList, fetchDVFunctionList]);

	React.useEffect(() => {
		loadData();
	}, []);

	React.useEffect(() => {
		if (searchTerm === '') {
		// 	setFunctionListInfo((prev) => {
		// 	console.log('prev', prev);
		// });
	}
		else {
			const filteredList = originalSTFunctionListInfo.filter((item) =>
				item.name.toLowerCase().includes(searchTerm.trimStart().toLowerCase()),
			);
			// setFunctionListInfo(filteredList);
		}
	}, [searchTerm]);

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

	const handleSearch = (term) => {
		setSearchTerm(term);
		console.log('Search term:', term);
	};

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
						<>
							<motion.div
								key={'div_schema_list1'}
								initial={{ opacity: 0, scale: 1, x: '-50%' }}
								animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
								exit={{ opacity: 0, scale: 1, x: '-50%' }}
								transition={{ duration: 0.2 }}
								style={{
									width: '350px',
									height: 'auto',
									backgroundColor: 'rgba(241, 243, 245, 0.8)',
									cursor: 'pointer',
									position: 'absolute',
									top: '24px',
									left: '24px',
									zIndex: '1000',
									padding: '10px',
									borderRadius: '8px',
								}}
							>
								<SearchBar onSearch={handleSearch} />
								<Category setSelectedCategory={setSelectedCategory} />
								{selectedCategory !== null && (
									<AnimatePresence>
										{functionlistInfo.ST.map((functionInfo, index) => {
											return (
												<motion.div
													key={'motiondiv_listcomp_' + index}
													initial={{ opacity: 0, scale: 0.6, x: '-20%' }}
													animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
													exit={{ opacity: 0, scale: 1, x: '100%' }}
													transition={{ duration: 0.2 }}
													style={{
														backgroundColor: '#fff',
														display: 'flex',
														flexDirection: 'row',
														alignItems: 'center',
														justifyContent: 'flex-start',
														padding: '5px',
														borderRadius: '5px',
														cursor: 'pointer',
													}}
												>
													<div style={{ width: '5px', height: '5px', borderRadius: '60%', backgroundColor:"blue", marginLeft:"10px" }}></div>
													<ListComp
														key={'listcomp_' + index}
														py={functionInfo.name}
														index={index}
														item={functionInfo}
														onChangeSchema={handleChangeSchema}
														onSetFunctionListInfo={handleSetSelectFunctionListInfo}
													/>
												</motion.div>
											);
										})}
									</AnimatePresence>
								)}
								{/* 
						</motion.div>
						<motion.div
							key={'div_schema_list2'}
							initial={{ opacity: 0, scale: 1, x: '-50%' }}
							animate={{ opacity: 1, scale: 1, x: '102%', y: 0 }}
							exit={{ opacity: 0, scale: 1, x: '-50%'}}
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
							<SearchBar onSearch={handleSearch} />
							{functionlistInfo.DV.map((functionInfo, index) => {
								return(
									<ListComp
										key={'listcomp_' + index}
										py={functionInfo.name}
										index={index}
										item={functionInfo}
										onChangeSchema={handleChangeSchema}
										onSetFunctionListInfo={handleSetSelectFunctionListInfo}
									/>
								)
							})} */}
							</motion.div>
						</>
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
