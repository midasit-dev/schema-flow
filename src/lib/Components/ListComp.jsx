import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SvgCheckCircle } from '../SVGComps';
import { SelectedSchema, FunctionListInfo } from '../RecoilAtom/recoilState';
import { useRecoilValue } from 'recoil';

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

const getSchema = async (functionName) => {
	const res = await fetch(
		`${process.env.REACT_APP_API_URL}backend/wgsd/functions/${functionName}`,
		{
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		},
	)
		.then((res) => res.json())
		.then((data) => {
			console.log(data);
		});
	// console.log("res", res);
};

const ListComp = (props) => {
	const { py, index, item, onChangeSchema, onSetFunctionListInfo } = props;
	const functionListInfo = useRecoilValue(FunctionListInfo);

	function onClickPyHandler(e) {
		// if function is already selected, then unselect it.
		if (item.isSelected) {
			onSetFunctionListInfo(index, false);
			onChangeSchema({});
			return;
		}

		// if function is not selected, then select it.
		onSetFunctionListInfo(index, true);
		console.log('item.schema', item.schema);
		onChangeSchema(item.schema);
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
			transition: { duration: 1.2, ease: 'easeOut' }, // 부드럽게 변화
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
				borderBottom: index !== functionListInfo.length - 1 ? '1px solid #c1c1c3' : 'none',
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

export default ListComp;
