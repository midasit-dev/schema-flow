import React from 'react';

// components
import { SvgPlus } from '../SVGComps';

export default function Recents(props) {
	const { width } = props;

	return (
		<div>
			<div
				style={{
					width: width,
					height: '300px',
					borderRadius: '10px',
					border: '1px solid #e6e6e6',
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					flexDirection: 'column',
					fontSize: '20px',
					color: '#000',
					fontFamily: 'Pretendard',
				}}
			>
				<div
					style={{
						width: '50px',
						height: '50px',
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
					}}
				>
					<SvgPlus />
				</div>
				Create
			</div>
		</div>
	);
}
