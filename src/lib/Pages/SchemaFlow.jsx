import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ReactFlowProvider } from '@xyflow/react';

// recoil
import { useSetRecoilState, useRecoilState, useRecoilValue } from 'recoil';
import { SelectedSchema, FunctionListInfo, FlowID } from '../RecoilAtom/recoilReactFlowState';

// components
import ReactFlowComp from '../Components/ReactFlowComp';
import { Svglist, Svgminimize } from '../Components/SVGComps';
import ListComp from '../Components/Functionlist/ListComp';
import SearchBar from '../Components/Functionlist/Searchbar';
import Category from '../Components/Functionlist/Category';

import { categoryList } from '../Common/string';
import { fetchFunction } from '../Common/fetch';

const getFunctionListFromWGSD = async (URI) => {
	const res = await fetchFunction({ baseUrl: URI });
	if (res && res.ok) {
		const data = await res.json();
		return data.functionIdList;
	}
	return [];
};

function SchemaFlow(props) {
	const [isopenList, setIsopenList] = React.useState(false);
	const [searchTerm, setSearchTerm] = React.useState('');
	const [selectedCategory, setSelectedCategory] = React.useState(null);
	const [selectedList, setSelectedList] = React.useState(null);
	const [isHoveredListIcon, setIsHoveredListIcon] = React.useState(false);

	const [functionlistInfo, setFunctionListInfo] = useRecoilState(FunctionListInfo);
	const setSchema = useSetRecoilState(SelectedSchema);
	const FlowId = useRecoilValue(FlowID);

	const toggleOpen = () => setIsopenList(!isopenList);

	const formatFunctionName = React.useCallback((name) => {
		name = name.replace(/_/g, ' ');
		return name.charAt(0).toUpperCase() + name.slice(1);
	}, []);

	const fetchFunctionList = React.useCallback(
		async (
			functionlistInfoLocal,
			baseURL,
			listpath,
			schemapath,
			executeServerPath,
			key,
			filter, // category subtitle ex) plugins, wgsd
		) => {
			const URI = `${baseURL}${listpath}`;
			const functionlist = await getFunctionListFromWGSD(URI);
			if (functionlist.length === 0) return [];
			const filterLowerCase = filter.toLowerCase();

			const newFunctionListInfo = functionlist
				// 필터링: 함수 이름에서 filter 값과 같은 것이 포함된 경우만 선택
				.filter((path) => {
					const pathLowerCase = path.toLowerCase();
					return pathLowerCase.includes(filterLowerCase);
				})
				.reduce(
					(
						acc /** typeof Array / acc */,
						path /** typeof Array / currentValue */,
						i /** currentIndex */,
					) => {
						let name = path.split('/').pop(); // path는 host/path/to/content/name --> name
						const queryParam = `?functionId=${path}`;
						name = formatFunctionName(name);
						const existingInfo =
							functionlistInfoLocal &&
							functionlistInfoLocal[key] &&
							functionlistInfoLocal[key].find((info) => info.name === name);
						const functionInfo = existingInfo
							? { ...existingInfo, id: `${key}_${i}_${name}`, param: queryParam }
							: {
									id: `${key}_${i}_${name}`,
									name,
									category: key, // WGSD_DV, WGSD_ST
									schema: {},
									isSelected: false,
									isRendered: false,
									viewCount: 0,
									param: queryParam,
									executepath: executeServerPath ? `${executeServerPath}${queryParam}` : null,
									schemapath: schemapath ? `${schemapath}${queryParam}` : null,
									baseURL: baseURL,
							  };

						acc.push(functionInfo);
						return acc;
					},
					[],
				);
			return newFunctionListInfo;
		},
		[formatFunctionName],
	);

	const loadData = React.useCallback(async () => {
		const localFlow = localStorage.getItem(FlowId);
		let functionlistInfoLocal = {};
		// if local storage is not empty and it is an array type, remove local storage FLOW
		if (localFlow) {
			const localFlowJson = JSON.parse(localFlow);
			if (localFlowJson.functionlistInfo) {
				functionlistInfoLocal = localFlowJson.functionlistInfo;
			}
		}

		categoryList.map(async (category) => {
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
						'backend/python-executor/execute',
						key,
						category.subTitle,
					);
					newFunctionList = { [key]: res };
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
						'backend/python-executor/execute',
						key,
						category.subTitle,
					);
					newFunctionList = { [key]: res };
					setFunctionListInfo((prev) => {
						const newdata = { ...prev, ...newFunctionList };
						return newdata;
					});
					break;
				default:
					console.warn('status:', category.status);
					break;
			}
		});
	}, [FlowId, fetchFunctionList, setFunctionListInfo]);

	React.useEffect(() => {
		loadData();
	}, []);

	React.useEffect(() => {
		if (selectedCategory === null) {
			setSearchTerm('');
			setSelectedList(null);
		} else {
			if (
				selectedCategory.subTitle === 'WGSD' ||
				selectedCategory.subTitle === 'PLUGINS' ||
				selectedCategory.subTitle === 'DgnEngine'
			) {
				const key = `${selectedCategory.subTitle}_${selectedCategory.status}`;
				setSelectedList((prev) => {
					if (!prev) return functionlistInfo[key];
					const list = functionlistInfo[key];
					const newList = prev.map((item) => {
						const updatedItem = list.find((listItem) => listItem.id === item.id);
						return updatedItem ? updatedItem : item;
					});
					return newList;
				});
			}
		}
	}, [selectedCategory, functionlistInfo]);

	React.useEffect(() => {
		if (selectedCategory !== null) {
			if (searchTerm === '') {
				if (
					selectedCategory.subTitle === 'WGSD' ||
					selectedCategory.subTitle === 'PLUGINS' ||
					selectedCategory.subTitle === 'DgnEngine'
				) {
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
					animate={{ width: isopenList ? '14px' : '18px', height: isopenList ? '14px' : '18px' }}
					exit={{ width: '24px', height: '24px' }}
					transition={{ duration: 0.2 }}
					onMouseEnter={() => setIsHoveredListIcon(true)}
					onMouseLeave={() => setIsHoveredListIcon(false)}
					style={{
						backgroundColor: 'white',
						cursor: 'pointer',
						position: 'fixed',
						top: '60px',
						left: '10px',
						zIndex: '2000',
						padding: '10px',
						borderRadius: '20%',
						border: isopenList ? '1px solid #c1c1c3' : '1px solid #e6e6e6',
						boxShadow: isHoveredListIcon ? '0 0 5px 0 rgba(0, 0, 0, 0.2)' : 'none',
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
									top: '78px',
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
														initial={{ opacity: 0, scale: 1, x: '-20%' }}
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

export default SchemaFlow;
