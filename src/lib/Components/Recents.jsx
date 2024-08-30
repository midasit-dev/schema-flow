import React from 'react';
import { motion } from 'framer-motion';

// components
import { SvgPlus } from '../SVGComps';

// css
import './Recents.css';

export default function Recents(props) {
	const { width = '200px' } = props;

	const [isHovered, setIsHovered] = React.useState(false);

	return (
		<div
			className='recents-container'
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			style={{ width, height: width }}
		>
			<div className='recents-inner' style={{ width, height: width }}>
				<div className='recents-icon-container'>
					<SvgPlus isHovered={isHovered} />
				</div>
				<div className='recents-text'>New Flow Project</div>
			</div>
		</div>
	);
}
