import React from 'react';
import { GuideBox, Panel, DataGrid, Button } from '@midasit-dev/moaui-components-v1';

export default function MatlConc_curve_uls(props) {
	console.log('Datagrid props', props);
	const [rowDatas, setRowDatas] = React.useState([
		{
			id: 0,
			stress: 0,
			strain: 0,
		},
		{
			id: 1,
			stress: 0,
			strain: 0.0006,
		},
		{
			id: 2,
			stress: 34,
			strain: 0.0006,
		},
		{
			id: 3,
			stress: 34,
			strain: 0.003,
		},
	]);
	const [columnDatas, setColumnDatas] = React.useState(['stress', 'strain']);
	const [height, setHeight] = React.useState(200);

	React.useEffect(() => {
		if (props.formData && props.formData.length > 0) {
      console.log('props.formData', props.formData);
			const rows = props.formData.map((point, index) => ({
				id: index, // Unique id for each row
				...point,
			}));
			const columns = Object.keys(props.formData[0]);
			setColumnDatas(columns);
			setRowDatas(rows);
			props.formData.length > 2
				? setHeight(props.formData.length * 42.2)
				: setHeight(props.formData.length * 52.3);
		}
	}, [props.formData]);

	function onClickAdd() {
		// add new row (use setRowDatas function)
		const newId = rowDatas.length + 1;
		setRowDatas([...rowDatas, { id: newId, stress: 0, strain: 0 }]);
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
						field: columnDatas[0],
						headerName: columnDatas[0].charAt(0).toUpperCase() + columnDatas[0].slice(1),
						width: 150,
					},
					{
						editable: true,
						field: columnDatas[1],
						headerName: columnDatas[1].charAt(0).toUpperCase() + columnDatas[1].slice(1),
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
				hideFooter={rowDatas.length > 5 ? false : true}
				hideFooterPagination={rowDatas.length > 5 ? false : true}
				hideFooterSelectedRowCount={rowDatas.length > 5 ? false : true}
				processRowUpdate={(newValue) => {
					props.onChange(
						props.formData.map((row, index) => {
							if (index === newValue.id) {
								for (const key in newValue) {
									if (key !== 'id') {
										row[key] = Number(newValue[key]);
									}
								}
								return row;
							}
							return row;
						}),
					);
					console.log('newValue', newValue);
					setRowDatas(
						rowDatas.map((row) =>
							row.id === newValue.id
								? {
										id: newValue['id'],
										stress: Number(newValue['stress']),
										strain: Number(newValue['strain']),
								  }
								: row,
						),
					);
					return newValue;
				}}
				onProcessRowUpdateError={(error) => {
					console.log('error', error);
				}}
			/>
		</div>
	);
}
