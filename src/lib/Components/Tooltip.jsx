import React from 'react';

// css
import './Tooltip.css';

/**
 * Tooltip component that displays a tooltip when hovering over the children element.
 *
 * @param {Object} props - The props for the Tooltip component.
 * @param {React.ReactNode} props.children - The element that will trigger the tooltip (text or JSX).
 * @param {React.ReactNode} props.content - The content of the tooltip (text or JSX).
 * @param {('top'|'bottom'|'left'|'right')} props.position - The position of the tooltip relative to the children element.
 * @default 'bottom'
 * @returns {JSX.Element} The rendered tooltip component.
 */
function Tooltip({ children, content, position = 'bottom' }) {
	return (
		<div className='tooltip-container'>
			{children}
			<div className={`tooltip tooltip-${position}`}>{content}</div>
		</div>
	);
}

export { Tooltip };
