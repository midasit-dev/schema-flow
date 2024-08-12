import React from 'react';
import { GuideBox, DataGrid, Button, Typography } from '@midasit-dev/moaui-components-v1';

const heightArr = [72.5, 105, 137, 169, 201];

export default function Lcom_FiexedField(props) {
	console.log('LcomField props', props);
	const [rowDatas, setRowDatas] = React.useState([]);
	const [columnHeaderDatas, setColumnHeaderDatas] = React.useState(['name', 'Nz', 'Mx', 'My']);
	const [columns, setColumns] = React.useState([{}]);
	const [height, setHeight] = React.useState(72.5);

	React.useEffect(() => {
		if (props.formData) {
			const rows = [{
				id: 0,
				name: props.formData.name,
				Nz: props.formData.f.Nz,
				Mx: props.formData.f.Mx,
				My: props.formData.f.My,
			}];
			console.log('rows', rows);
			setRowDatas(rows);
		} else {
			setColumnHeaderDatas([]);
			setRowDatas([]);
		}
	}, [props.formData]);

	React.useEffect(() => {
		if (columnHeaderDatas.length > 0) {
			let columns = [
				{
					editable: false,
					field: 'id',
					headerName: 'Id',
					width: 60,
				},
			];
			columnHeaderDatas.forEach((column, index) => {
				columns.push({
					editable: true,
					field: column,
					headerName: column.charAt(0).toUpperCase() + column.slice(1),
					width: 80,
				});
			});
			setColumns(columns);
		}
	}, [columnHeaderDatas]);

	function onClickAdd() {
		// add new row (use setRowDatas function)
		const newId = rowDatas.length;
		setRowDatas([...rowDatas, { id: newId, name: `uls${newId + 1}`, Nz: 0, Mx: 0, My: 0 }]);
		props.onChange([...props.formData, { name: `uls${newId + 1}`, f: { Nz: 0, Mx: 0, My: 0 } }]);
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
		<div style={{ height: height + 40, marginTop: '10px', marginBottom: '10px' }}>
			<Typography variant='h1' size='large'>
				{props.schema.title}
			</Typography>
			<div style={{ height: height, marginTop: '10px' }}>
				<DataGrid
					columns={columns}
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
						const row = props.formData;
						console.log('row', row);
						for (const key in newValue) {
							if (key !== 'id') {
								if (key === 'name') {
									row[key] = newValue[key];
								} else {
									row.f[key] = Number(newValue[key]);
								}
							}
						}
						props.onChange(row);
						setRowDatas(
							rowDatas.map((row) =>
								row.id === newValue.id
									? {
											id: newValue['id'],
											name: Number(newValue['name']),
											Nz: Number(newValue['Nz']),
											Mx: Number(newValue['Mx']),
											My: Number(newValue['My']),
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
		</div>
	);
}
