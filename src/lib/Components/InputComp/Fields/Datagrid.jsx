import React from 'react';
import { GuideBox, DataGrid, Button } from '@midasit-dev/moaui-components-v1';

export default function Datagrid(props) {
	console.log('Datagrid props', props);
	const [rowDatas, setRowDatas] = React.useState([
		{ id: 1, stress: 1, strain: 2 },
		{ id: 2, stress: 3, strain: 4 },
		{ id: 3, stress: 5, strain: 6 },
		{ id: 4, stress: 7, strain: 8 },
		{ id: 5, stress: 9, strain: 10 },
	]);
	const [height, setHeight] = React.useState(0);

	React.useEffect(() => {
		if (props.formData) {
			const rows = props.formData.map((point, index) => ({
				id: index, // Unique id for each row
				...point,
			}));
			console.log('rows', rows);
			setRowDatas(rows);
			props.formData.length > 2
				? setHeight(props.formData.length * 42.2)
				: setHeight(props.formData.length * 52.3);
		}
	}, [props.formData]);

	function onClickAdd() {
		// add new row (use setRowDatas function)
		const newId = rowDatas.length + 1;
		const newRow = { id: newId, stress: 0, strain: 0 };
		setRowDatas([...rowDatas, newRow]);
		props.onChange([...props.formData, { stress: 0, strain: 0 }]);
	}

	function onClickDelete() {
		// delete last row (use setRowDatas function)
		// consider rowDatas.length > 0
		if (rowDatas.length > 0) {
			setRowDatas(rowDatas.slice(0, rowDatas.length - 1));
			props.onChange(props.formData.slice(0, props.formData.length - 1));
		}
	}

	return (
		<div style={{ height: height, marginTop: '40px' }}>
			<GuideBox horRight row width={'100%'} marginBottom={1} spacing={1}>
				<Button width='auto' color='normal' onClick={onClickAdd}>
					Add
				</Button>
				<Button width='20px' color='negative' onClick={onClickDelete}>
					Delete
				</Button>
			</GuideBox>
			<DataGrid
				columns={[
					{
						editable: false,
						field: 'id',
						headerName: 'Id',
						width: 60,
					},
					{
						editable: true,
						field: 'stress',
						headerName: 'Stress',
						width: 150,
					},
					{
						editable: true,
						field: 'strain',
						headerName: 'Strain',
						width: 150,
					},
				]}
				initialState={{
					pagination: {
						paginationModel: {
							pageSize: 5,
						},
					},
				}}
				pageSizeOptions={[5]}
				rows={rowDatas}
				hideFooter
				hideFooterPagination
				hideFooterSelectedRowCount
				processRowUpdate={(newValue) => {
					console.log('newValue', newValue);
					props.onChange(
						props.formData.map((row, index) =>
							index === newValue.id
								? {
										stress: Number(newValue['stress']),
										strain: Number(newValue['strain']),
								  }
								: row,
						),
					);
					setRowDatas(
						rowDatas.map((row) =>
							row.id === newValue.id
								? {
										Id: newValue['id'],
										Stress: Number(newValue['stress']),
										Strain: Number(newValue['strain']),
								  }
								: row,
						),
					);
					return newValue;
				}}
				onProcessRowUpdateError={(error) => {
					console.log('error', error);
				}}
				cellFontSize='10px'
				columnFontSize='12px'
			/>
		</div>
	);
}
