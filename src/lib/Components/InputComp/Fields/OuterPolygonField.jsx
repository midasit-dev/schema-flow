import React, { useState } from "react";
import { DataGrid, GridToolbarContainer, GridToolbarExport } from "@mui/x-data-grid";
import { Button } from "@mui/material";

const OuterPolygonField = (props) => {
  const { formData, onChange, schema } = props;

  // DataGrid에 필요한 열 정의
  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "x", headerName: "X", width: 150, editable: true },
    { field: "y", headerName: "Y", width: 150, editable: true },
  ];

  // 기본 데이터에 ID 추가
  const initialRows = formData.map((point, index) => ({
    id: index,
    ...point,
  }));

  // 상태 관리
  const [rows, setRows] = useState(initialRows);

  // 데이터 변경 시 호출
  const handleProcessRowUpdate = (newRow) => {
    const updatedRows = rows.map((row) => (row.id === newRow.id ? newRow : row));
    setRows(updatedRows);

    // 외부 onChange 호출하여 폼 상태 업데이트
    onChange(updatedRows.map(({ id, ...rest }) => rest));
    return newRow;
  };

  // 항목 추가
  const handleAddPoint = () => {
    const newId = rows.length > 0 ? Math.max(rows.map((row) => row.id)) + 1 : 0;
    const newPoint = { id: newId, x: 0, y: 0 };
    const updatedRows = [...rows, newPoint];
    setRows(updatedRows);

    // 외부 onChange 호출하여 폼 상태 업데이트
    onChange(updatedRows.map(({ id, ...rest }) => rest));
  };

  // 항목 삭제
  const handleDeletePoint = (id) => {
    const updatedRows = rows.filter((row) => row.id !== id);
    setRows(updatedRows);

    // 외부 onChange 호출하여 폼 상태 업데이트
    onChange(updatedRows.map(({ id, ...rest }) => rest));
  };

  // 툴바 컴포넌트 정의
  const CustomToolbar = () => {
    return (
      <GridToolbarContainer>
        <Button color="primary" onClick={handleAddPoint}>
          Add Point
        </Button>
        <GridToolbarExport />
      </GridToolbarContainer>
    );
  };

  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        processRowUpdate={handleProcessRowUpdate}
        components={{
          Toolbar: CustomToolbar,
        }}
        experimentalFeatures={{ newEditingApi: true }}
        disableRowSelectionOnClick
        onRowEditStop={(params, event) => {
          if (event.reason === "escapeKeyDown") {
            // Esc 키가 눌릴 경우 변경 사항 취소
            event.defaultMuiPrevented = true;
            const oldRow = rows.find((row) => row.id === params.row.id);
            handleProcessRowUpdate(oldRow);
          }
        }}
        onProcessRowUpdateError={(error) => {
          console.error("Row update error:", error);
        }}
      />
      <Button
        color="secondary"
        onClick={() => {
          if (rows.length > 0) {
            const lastId = rows[rows.length - 1].id;
            handleDeletePoint(lastId);
          }
        }}
      >
        Delete Last Point
      </Button>
    </div>
  );
};

export default OuterPolygonField;
