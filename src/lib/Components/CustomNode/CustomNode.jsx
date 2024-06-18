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
					<div>
						<SchemaToUI nodeId={id} schemaInfo={data.schemainfo} onRemove={data.onRemove} />
					</div>
					<Handle type='target' position={Position.Top} />
					<Handle type='target' position={Position.Bottom} />
					<Handle type='target' position={Position.Left} />
					<Handle type='target' position={Position.Right} />
				</div>
			)}
		</>
	);
}
