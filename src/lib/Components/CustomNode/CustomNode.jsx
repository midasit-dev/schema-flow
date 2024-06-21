import React from 'react';
import { Handle, useStore, Position, useReactFlow, NodeResizer } from 'reactflow';
import { isEmpty } from 'lodash';

import SchemaToUI from '../../SchemaToUI';
import './CustomNode.css';

// noticestack
import { SnackbarProvider } from 'notistack';

//recoil
import { useRecoilValue } from 'recoil';
import { SelectedSchema } from '../../RecoilAtom/recoilState';

export default function CustomNode(props) {
	const { id, data } = props;

	return (
		<SnackbarProvider
			maxSnack={3}
			anchorOrigin={{
				vertical: 'bottom',
				horizontal: 'center',
			}}
			autoHideDuration={2000}
			iconVariant={{
				success: (
					<svg
						width='16'
						height='16'
						viewBox='0 0 16 16'
						fill='none'
						xmlns='http://www.w3.org/2000/svg'
					>
						<mask
							id='mask0_10026_98183'
							maskUnits='userSpaceOnUse'
							x='0'
							y='0'
							width='16'
							height='16'
						>
							<rect width='16' height='16' fill='#D9D9D9' />
						</mask>
						<g mask='url(#mask0_10026_98183)'>
							<rect x='2' y='2' width='12' height='12' rx='6' stroke='#F4F7FB' />
							<path
								d='M5.46447 8.03553L7.58579 10.1569L11.1213 6.62132'
								stroke='#F4F7FB'
								strokeLinecap='round'
								strokeLinejoin='round'
							/>
						</g>
					</svg>
				),
				error: (
					<svg
						width='16'
						height='16'
						viewBox='0 0 16 16'
						fill='none'
						xmlns='http://www.w3.org/2000/svg'
					>
						<mask
							id='mask0_9980_84585'
							maskUnits='userSpaceOnUse'
							x='0'
							y='0'
							width='16'
							height='16'
						>
							<rect width='16' height='16' fill='#D9D9D9' />
						</mask>
						<g mask='url(#mask0_9980_84585)'>
							<rect x='2' y='2' width='12' height='12' rx='6' stroke='#F4F7FB' />
							<path d='M8 7.3999L8 11.3999' stroke='#F4F7FB' strokeLinecap='round' />
							<rect
								width='1.4'
								height='1.4'
								rx='0.7'
								transform='matrix(1 0 0 -1 7.2998 5.8999)'
								fill='#F4F7FB'
							/>
						</g>
					</svg>
				),
				warning: '⚠️',
				info: 'ℹ️',
			}}
		>
			{!isEmpty(data.schemainfo) && (
				<div className={data.edit ? 'shake' : ''} style={{ paddingBottom: 29 }}>
					<Handle id={'top_' + id} type='target' position={Position.Top} />
					<div>
						<SchemaToUI nodeId={id} schemaInfo={data.schemainfo} onRemove={data.onRemove} />
					</div>
					<Handle id={'left_' + id} type='target' position={Position.Left} />
					<Handle id={'right_' + id} type='source' position={Position.Right} />
					<Handle id={'bottom_' + id} type='source' position={Position.Bottom} />
				</div>
			)}
		</SnackbarProvider>
	);
}
