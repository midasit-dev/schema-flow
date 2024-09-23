import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SvgCheckCircle } from '../SVGComps';
import { FunctionListInfo } from '../../RecoilAtom/recoilReactFlowState';
import { useRecoilValue } from 'recoil';

const getSchemaFromServer = async (URI) => {
	const res = await fetch(`${URI}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
		},
	});
	if (res.ok) {
		const data = await res.json();
		console.log('data', data);
		return data;
	}
	return null;
};

const ListComp = (props) => {
	const { index, item, onChangeSchema, onSetFunctionListInfo } = props;

	async function onClickPyHandler(e) {
		// if function is already selected, then unselect it.
		if (item.isSelected) {
			onSetFunctionListInfo(index, false, item.category);
			onChangeSchema({});
			return;
		}
		const schemaURI = `${item.baseURL}${item.schemapath}`;
		const executeURI = `${item.baseURL}${item.executepath}`;
		const openAPIschema = await getSchemaFromServer(schemaURI);
		if (openAPIschema !== null) {
			const paths = openAPIschema.paths;
			let dereferencedFunctionSchema = {};
			for (const key in paths) {
				// ex) key is '/moapy/project/wgsd/wgsd_flow/calc_3dpm'
				if (paths[key]['post']['requestBody']['content']['application/json']['schema'])
					dereferencedFunctionSchema =
						paths[key]['post']['requestBody']['content']['application/json']['schema'];
				else alert('No schema found in the selected function');
			}
			console.log('dereferencedFunctionSchema', dereferencedFunctionSchema);
			dereferencedFunctionSchema.title = '';
			// if function is not selected, then select it.
			onSetFunctionListInfo(index, true, item.category, dereferencedFunctionSchema);
			onChangeSchema({
				id: `${item.id}`,
				title: `${item.name} (${item.category})`,
				schema: dereferencedFunctionSchema,
				path: item.param,
				category: item.category,
				executeURI: executeURI,
			});
		} else console.error('Failed to get schema from server');
	}

	const ty = React.useMemo(() => 46, []);
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
			transition: { duration: 0.2, ease: 'linear' },
		},
		move: {
			transform: [`translate(0%, -${ty}%)`, `translate(-50%, -${ty}%)`],
			transition: { repeat: Infinity, repeatType: 'reverse', duration: 0.8 },
		},
		shrink: {
			// x: [null, 'calc(100% - 16px)'], // x 좌표는 계산된 위치로 이동
			transform: [null, ``, `translateY(-${ty}%) scale(1)`, `translate(${tx}%, -${ty}%) scale(0)`], // 크기를 0으로 줄임
			// opacity: [1, 0], // 불투명에서 투명으로
			transition: { duration: 0.6, ease: 'easeOut' }, // 부드럽게 변화
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
				position: 'relative',
				overflow: 'hidden', // 자식 요소가 부모 요소 밖으로 넘치지 않도록
				marginRight: '20px',
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
					color: item.isSelected ? 'white' : 'black',
					fontSize: '16px',
					fontFamily: 'pretendard',
					marginLeft: '3px',
				}}
			>
				{item.name}
				<div style={{ width: '20px', height: '20px', marginRight: '5px' }}>
					{item.isRendered && item.viewCount > 1 && (
						<div
							style={{
								position: 'absolute',
								width: '10px',
								height: '10px',
								color: item.isSelected ? 'white' : 'black',
								fontSize: '11px',
								fontWeight: 500,
								fontFamily: 'pretendard',
								top: 0,
								right: 0,
							}}
						>
							{item.viewCount}
						</div>
					)}
					<SvgCheckCircle color={item.isSelected ? 'white' : 'black'} isVisible={item.isRendered} />
				</div>
			</div>
		</motion.div>
	);
};

export default ListComp;
