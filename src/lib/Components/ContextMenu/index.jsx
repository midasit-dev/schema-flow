import React, { useState } from 'react';
import './App.css';

const ContextMenu = () => {
	const [menuVisible, setMenuVisible] = useState(false);
	const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });

	const handleContextMenu = (event) => {
		event.preventDefault();
		setMenuPosition({ x: event.clientX, y: event.clientY });
		setMenuVisible(true);
	};

	const handleClick = () => {
		setMenuVisible(false);
	};

	return (
		<ul
			className='context-menu'
			style={{
				top: menuPosition.y,
				left: menuPosition.x,
				position: 'absolute',
				backgroundColor: 'white',
				border: '1px solid #ccc',
				boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
				listStyle: 'none',
				padding: '10px 0',
				zIndex: 1000,
			}}
		>
			<li>Option 1</li>
			<li>Option 2</li>
			<li>Option 3</li>
		</ul>
	);
};

export default ContextMenu;
