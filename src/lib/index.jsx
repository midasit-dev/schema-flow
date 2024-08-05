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
import { Categorylist } from './Common/string';
import MarkdownViewer from './Components/OutputComp/MarkdownViewer';
import ImageViewer from './Components/OutputComp/ImageViewer';

const getFunctionListFromWGSD = async (URI) => {
	const res = await fetch(`${URI}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
		},
	});
	const data = await res.json();
	console.log(`${URI}`, data);
	return data;
};

function App(props) {
	const [isopenList, setIsopenList] = React.useState(false);
	const [searchTerm, setSearchTerm] = React.useState('');
	const [functionlistInfo, setFunctionListInfo] = useRecoilState(FunctionListInfo);
	const [originalFunctionListInfo, setOriginalFunctionListInfo] = React.useState({});
	const [selectedCategory, setSelectedCategory] = React.useState(null);
	const [selectedList, setSelectedList] = React.useState(null);

	const setSchema = useSetRecoilState(SelectedSchema);

	const toggleOpen = () => setIsopenList(!isopenList);

	const formatFunctionName = React.useCallback((name) => {
		name = name.replace(/_/g, ' ');
		return name.charAt(0).toUpperCase() + name.slice(1);
	}, []);

	const fetchFunctionList = React.useCallback(
		async (functionlistInfoLocal, baseURL, listpath, schemapath, executeServerPath, key) => {
			const URI = `${baseURL}${listpath}`;
			const functionlist = await getFunctionListFromWGSD(URI);
			if (functionlist.length === 0) return;

			const newFunctionListInfo = functionlist.reduce((acc, path, i) => {
				let name = path.split('/').pop();
				const encodedPath = encodeURIComponent(path);
				name = formatFunctionName(name);
				const existingInfo =
					functionlistInfoLocal &&
					functionlistInfoLocal[key] &&
					functionlistInfoLocal[key].find((info) => info.name === name);
				const functionInfo = existingInfo
					? { ...existingInfo, id: `${key}_${i}_${name}`, param: encodedPath }
					: {
							id: `${key}_${i}_${name}`,
							name,
							category: key, // WGSD_DV, WGSD_ST
							schema: {},
							isSelected: false,
							isRendered: false,
							viewCount: 0,
							param: encodedPath,
							executepath: executeServerPath ? `${executeServerPath}${encodedPath}` : null,
							schemapath: schemapath ? `${schemapath}${encodedPath}` : null,
							baseURL: baseURL,
					  };

				acc.push(functionInfo);
				return acc;
			}, []);

			return newFunctionListInfo;
		},
		[formatFunctionName],
	);

	const loadData = React.useCallback(async () => {
		const localFlow = localStorage.getItem('FLOW');
		let functionlistInfoLocal = {};
		// if local storage is not empty and it is an array type, remove local storage FLOW
		if (localFlow) {
			const localFlowJson = JSON.parse(localFlow);
			if (Array.isArray(localFlowJson.functionlistInfo)) {
				localStorage.removeItem('FLOW');
			} else if (localFlowJson.functionlistInfo) {
				functionlistInfoLocal = localFlowJson.functionlistInfo;
			}
		}

		Categorylist.map(async (category) => {
			if (category.subTitle === 'WGSD') {
				let res = null;
				let key = '';
				let newFunctionList = {};
				switch (category.status) {
					case 'DV':
						key = `${category.subTitle}_${category.status}`;
						res = await fetchFunctionList(
							functionlistInfoLocal,
							process.env.REACT_APP_ACTUAL_DV_API_URL,
							'backend/wgsd/functions',
							'backend/wgsd/function-schemas/',
							'backend/function-executor/python-execute/',
							key,
						);
						newFunctionList = { [key]: res };
						setOriginalFunctionListInfo((prev) => {
							return { ...prev, ...newFunctionList };
						});
						setFunctionListInfo((prev) => {
							const newdata = { ...prev, ...newFunctionList };
							return newdata;
						});
						break;
					case 'ST':
						key = `${category.subTitle}_${category.status}`;
						res = await fetchFunctionList(
							functionlistInfoLocal,
							process.env.REACT_APP_ACTUAL_ST_API_URL,
							'backend/wgsd/functions',
							'backend/wgsd/function-schemas/',
							'backend/function-executor/python-execute/',
							key,
						);
						newFunctionList = { [key]: res };
						setOriginalFunctionListInfo((prev) => {
							return { ...prev, ...newFunctionList };
						});
						setFunctionListInfo((prev) => {
							const newdata = { ...prev, ...newFunctionList };
							return newdata;
						});
						break;
					default:
						console.log('No status');
						break;
				}
			}
		});
	}, [setFunctionListInfo, fetchFunctionList]);

	React.useEffect(() => {
		loadData();
	}, []);

	React.useEffect(() => {
		if (selectedCategory === null) {
			setSearchTerm('');
			setSelectedList(null);
		} else {
			if (selectedCategory.subTitle === 'WGSD') {
				const key = `${selectedCategory.subTitle}_${selectedCategory.status}`;
				setSelectedList((prev) => {
					if (!prev) return functionlistInfo[key];
					const list = functionlistInfo[key];
					const newList = prev.map((item) => {
						const updatedItem = list.find((listItem) => listItem.id === item.id);
						return updatedItem ? updatedItem : item;
					});
					console.log('newList', newList);
					return newList;
				});
			}
		}
	}, [selectedCategory, functionlistInfo]);

	React.useEffect(() => {
		if (selectedCategory !== null) {
			if (searchTerm === '') {
				if (selectedCategory.subTitle === 'WGSD') {
					const key = `${selectedCategory.subTitle}_${selectedCategory.status}`;
					setSelectedList(functionlistInfo[key]);
				}
			} else {
				const key = `${selectedCategory.subTitle}_${selectedCategory.status}`;
				const filteredList = functionlistInfo[key].filter((item) =>
					item.name.toLowerCase().includes(searchTerm.trimStart().toLowerCase()),
				);
				setSelectedList(filteredList);
			}
		}
	}, [searchTerm]);

	const handleSetSelectFunctionListInfo = React.useCallback(
		(index, isSelected, category, schema) => {
			console.log('index', index);
			setFunctionListInfo((prev) => {
				const updatedItems = prev[category].map((item, idx) => {
					if (idx !== index) {
						// 현재 아이템이 선택 대상이 아닌 경우, isSelected가 true일 때만 false로 설정
						return isSelected ? { ...item, isSelected: false } : { ...item };
					}

					// 선택된 아이템에 대해 isSelected 상태와 선택된 경우 schema 업데이트
					return {
						...item,
						isSelected,
						...(isSelected && { schema }), // isSelected가 true일 경우에만 schema 추가
					};
				});

				// 기존 데이터 구조 유지, 변경된 데이터를 반영하여 새로운 객체 생성
				return {
					...prev,
					[category]: updatedItems,
				};
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
								{selectedCategory && selectedList && (
									<SearchBar onSearch={handleSearch} test={'TEST'} />
								)}

								<Category setSelectedCategory={setSelectedCategory} />
								{selectedCategory !== null && selectedList !== null && (
									<AnimatePresence>
										<div style={{ height: '800px', overflowY: 'scroll' }}>
											{selectedList.map((functionInfo, index) => {
												return (
													<motion.div
														key={'motiondiv_listcomp_' + index}
														initial={{ opacity: 0, scale: 0.6, x: '-20%' }}
														animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
														exit={{ opacity: 0, scale: 1, x: '20%' }}
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
														<div
															style={{
																width: '5px',
																height: '5px',
																borderRadius: '60%',
																backgroundColor: 'blue',
																marginLeft: '10px',
																marginRight: '10px',
															}}
														/>
														<ListComp
															key={'listcomp_' + index}
															index={index}
															item={functionInfo}
															onChangeSchema={handleChangeSchema}
															onSetFunctionListInfo={handleSetSelectFunctionListInfo}
														/>
													</motion.div>
												);
											})}
										</div>
									</AnimatePresence>
								)}
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
