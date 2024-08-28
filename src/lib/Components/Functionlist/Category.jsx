import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { categoryList } from '../../Common/string';
// Import the CSS file
import './Category.css';

// Component for Category Header
const CategoryHeader = () => {
	return <div className='card-header'>Category</div>;
};

// Component for Icon Box
const IconBox = ({ children, backgroundColor }) => {
	return (
		<div className='icon' style={{ backgroundColor }}>
			{children}
		</div>
	);
};

// Component for Title
const Title = ({ children }) => {
	return <div className='category-title'>{children}</div>;
};

// Component for Sub Container
const SubContainer = ({ children }) => {
	return <div className='sub-container'>{children}</div>;
};

// Component for Sub Icon Box
const SubIconBox = ({ children, backgroundColor }) => {
	return (
		<div className='sub-icon' style={{ backgroundColor }}>
			{children}
		</div>
	);
};

// Component for Sub Title
const SubTitle = ({ children }) => {
	return <div className='sub-title'>{children}</div>;
};

// Component for Status
const Status = ({ children }) => {
	return <div className='status'>{children}</div>;
};

// Card Component
const Card = ({ title, subTitle, status, onClick }) => {
	// Handle click event directly inside Card component
	const handleClick = () => {
		// Create an object containing all the necessary information
		const cardInfo = {
			title,
			subTitle,
			status,
		};
		onClick(cardInfo); // Pass the cardInfo object to the onClick function
	};

	return (
		<div className='card' onClick={handleClick}>
			<CategoryHeader />
			<div className='card-content'>
				<IconBox backgroundColor='#2c67f5'>Title</IconBox>
				<Title>{title}</Title>
			</div>
			<div className='card-footer'>
				<SubContainer>
					<SubIconBox backgroundColor='#4eadf8'>Sub</SubIconBox>
					<SubTitle>{subTitle}</SubTitle>
				</SubContainer>
				<Status>{status}</Status>
			</div>
		</div>
	);
};

// AddFunctionButton Component
const AddFunctionButton = () => {
	return (
		<div className='add-container'>
			<div className='add-icon'>
				<svg
					width='100%'
					height='100%'
					viewBox='0 0 24 24'
					fill='none'
					xmlns='http://www.w3.org/2000/svg'
				>
					<path
						d='M12 8V16M8 12H16M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z'
						stroke='rgba(78, 173, 248, 1)'
						strokeWidth='2'
						strokeLinecap='round'
						strokeLinejoin='round'
					/>
				</svg>
			</div>
			<div className='add-text'>Add OpenAPI Function SET +</div>
		</div>
	);
};

const BackToCategoryButton = ({ onClick }) => {
	return (
		<div className='back-button' onClick={onClick}>
			<svg
				width='100%'
				height='100%'
				viewBox='0 0 24 24'
				fill='none'
				xmlns='http://www.w3.org/2000/svg'
			>
				<path
					d='M3 9H16.5C18.9853 9 21 11.0147 21 13.5C21 15.9853 18.9853 18 16.5 18H12M3 9L7 5M3 9L7 13'
					stroke='rgba(78, 173, 248, 1)'
					strokeWidth='2'
					strokeLinecap='round'
					strokeLinejoin='round'
				/>
			</svg>
		</div>
	);
};

const SelectedCategory = ({ selectedCard, setSelectedCard }) => {
	const handleBack = () => {
		// Handle back button click
		setSelectedCard(null);
	};
	return (
		<div className='selected-category'>
			<BackToCategoryButton onClick={handleBack} />
			<div className='selected-category-text'>
				{selectedCard.subTitle} - {selectedCard.status}
			</div>
		</div>
	);
};

// Main Category Component
export default function Category(props) {
	const { setSelectedCategory } = props;
	const [selectedCard, setSelectedCard] = React.useState(null); // State for storing selected card

	React.useEffect(() => {
		setSelectedCategory(selectedCard);
	}, [selectedCard]);

	// Function to handle card click
	const handleCardClick = (card) => {
		const category = { title: card.title, subTitle: card.subTitle, status: card.status };
		setSelectedCard(category);
	};

	return (
		<div>
			{selectedCard !== null && (
				<motion.div
					initial={{ opacity: 0, scale: 0.6, x: '-20%' }}
					animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
					exit={{ opacity: 0, scale: 1, x: '100%' }}
					transition={{ duration: 0.2 }}
				>
					<SelectedCategory selectedCard={selectedCard} setSelectedCard={setSelectedCard} />
				</motion.div>
			)}
			{selectedCard === null && (
				<AnimatePresence>
					{categoryList.map((category, index) => (
						<motion.div
							key={`motion_${category.title}_${category.subTitle}_${category.status}`}
							initial={{ opacity: 0, y: `${-50 - index * 30}%` }} // Adjusted to provide a consistent offset
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: `${-100 - index * 100}%` }}
							transition={{ delay: 0.1 }}
						>
							<Card
								title={category.title}
								subTitle={category.subTitle}
								status={category.status}
								onClick={() => handleCardClick(category)}
							/>
						</motion.div>
					))}
					<AddFunctionButton />
				</AnimatePresence>
			)}
		</div>
	);
}
