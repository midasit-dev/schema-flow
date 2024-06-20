import React from 'react';
import { Handle, useStore, Position, useReactFlow, NodeResizer } from 'reactflow';
import { isEmpty } from 'lodash';

import SchemaToUI from '../../SchemaToUI';
import './CustomNode.css';

//recoil
import { useRecoilValue } from 'recoil';
import { SelectedSchema } from '../../RecoilAtom/recoilState';

export default function CustomNode(props) {
	const { id, data } = props;

	return (
		<>
			{!isEmpty(data.schemainfo) && (
				<div className={data.edit ? 'shake' : ''}>
					<Handle id={'top_' + id} type='target' position={Position.Top} />
					<div>
						<SchemaToUI nodeId={id} schemaInfo={data.schemainfo} onRemove={data.onRemove} />
					</div>
					<Handle id={'left_' + id} type='target' position={Position.Left} />
					<Handle id={'right_' + id} type='source' position={Position.Right} />
					<Handle id={'bottom_' + id} type='source' position={Position.Bottom} />
				</div>
			)}
		</>
	);
}
