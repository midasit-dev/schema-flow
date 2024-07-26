// MuiDataGridWidget.js

import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button } from '@mui/material';

const MuiDataGridWidget = ({ id, value, onChange }) => {
	console.log('value', value);
	const columns = [
		{ field: 'x', headerName: 'X', width: 150, editable: true },
		{ field: 'y', headerName: 'Y', width: 150, editable: true },
	];

	const handleProcessRowUpdate = (newRow) => {
		const updatedRows = value.map((row) => (row.id === newRow.id ? newRow : row));
		onChange(updatedRows);
		return newRow;
	};

	const handleAddRow = () => {
		const newRow = {
			id: value.length, // Unique id for each row
			x: 0,
			y: 0,
		};
		onChange([...value, newRow]);
	};

	const handleDeleteRow = (idToDelete) => {
		const updatedRows = value.filter((row) => row.id !== idToDelete);
		onChange(updatedRows);
	};

	const rows = value.map((point, index) => ({
		id: index, // Unique id for each row
		...point,
	}));

	return (
		<div style={{ height: 300, width: '100%' }}>
			<DataGrid
				rows={rows}
				columns={columns}
				processRowUpdate={handleProcessRowUpdate}
				rowHeight={30}
				autoHeight
				columnHeaderHeight={30}
			/>
			<Button onClick={handleAddRow} variant='contained' color='primary' style={{ marginTop: 8 }}>
				Add Point
			</Button>
			<Button
				onClick={() => handleDeleteRow(rows.length - 1)}
				variant='contained'
				color='secondary'
				style={{ marginTop: 8, marginLeft: 8 }}
			>
				Delete Point
			</Button>
		</div>
	);
};

export default MuiDataGridWidget;
