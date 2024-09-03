import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SvgSearch } from '../SVGComps';

const inputStyle = {
	border: 'none',
	outline: 'none',
	width: '100%',
	flex: 1,
	background: 'none',
	fontFamily: 'pretendard',
	fontSize: '15px',
	color: '#000',
};

const SearchBar = ({ onSearch }) => {
	const [searchTerm, setSearchTerm] = useState('');
	const [isFocused, setIsFocused] = useState(false);

	const handleChange = (event) => {
		const value = event.target.value;
		setSearchTerm(value);
		onSearch(value); // 부모 컴포넌트에 값을 전달
	};

	return (
		<div
			style={{
				display: 'flex',
				alignItems: 'center',
				border: 'none',
				borderRadius: '4px',
				padding: '8px',
				width: '100%',
				boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
				marginBottom: '5px',
				backgroundColor: isFocused ? '#fff' : 'transparent',
				transition: 'background-color 0.6s ease-in-out',
			}}
		>
			<div style={{ width: '20px', height: '20px', marginRight: '5px', marginLeft: '5px' }}>
				<SvgSearch isFocused={isFocused} />
			</div>
			<AnimatePresence>
				<motion.input
					key='focused'
					initial={{ opacity: 0, x: -20 }}
					animate={{ opacity: 1, x: 0 }}
					exit={{ opacity: 0, x: 20 }}
					transition={{ duration: 0.3 }}
					type='text'
					value={searchTerm}
					onChange={handleChange}
					onFocus={() => setIsFocused(true)}
					onBlur={() => setIsFocused(false)}
					placeholder={isFocused ? '' : 'Search...'}
					style={{ ...inputStyle }}
				/>
			</AnimatePresence>
		</div>
	);
};

export default SearchBar;
