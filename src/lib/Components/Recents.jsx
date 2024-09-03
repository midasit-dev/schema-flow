import React from 'react';
import { useNavigate } from 'react-router-dom';

// components
import { SvgPlus } from '../SVGComps';

// css
import './Recents.css';

function NewFlowProject({ width }) {
	const [isHovered, setIsHovered] = React.useState(false);

	return (
		<div
			className='recents-container'
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			style={{ width, height: width }}
		>
			<div className='recents-inner'>
				<div className='recents-icon-container'>
					<SvgPlus isHovered={isHovered} />
				</div>
				<div className='recents-text'>New Flow Project</div>
			</div>
		</div>
	);
}

export default function Recents(props) {
	const { width = '200px' } = props;

	const navigate = useNavigate();

	return (
		<div onClick={() => navigate('../Flow/Untitled')}>
			<NewFlowProject width={width} />
		</div>
	);
}
