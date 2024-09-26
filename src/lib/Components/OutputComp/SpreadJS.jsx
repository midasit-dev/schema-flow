import React, { useRef } from 'react';
import * as GC from '@grapecity/spread-sheets';
import { SpreadSheets } from '@grapecity/spread-sheets-react';
import '@grapecity/spread-sheets/styles/gc.spread.sheets.excel2013white.css';
// 명시적으로 spread-excelio 모듈을 가져오기
import * as ExcelIO from '@grapecity/spread-excelio';

const hostStyle = {
	width: '55rem',
	height: '100%',
	border: '1px solid darkgray',
};

export default function SpreadJS({ base64Data }) {
	const spreadInstance = useRef(null); // SpreadSheets 인스턴스 저장

	React.useEffect(() => {
		if (base64Data && spreadInstance.current) {
			// base64 데이터를 binary로 변환
			const binary = atob(base64Data);
			const len = binary.length;
			const buffer = new ArrayBuffer(len);
			const view = new Uint8Array(buffer);
			for (let i = 0; i < len; i++) {
				view[i] = binary.charCodeAt(i);
			}
			const blob = new Blob([view], { type: 'application/octet-stream' });

			const reader = new FileReader();
			reader.onload = function (e) {
				const arrayBuffer = e.target.result;
				const excelIO = new ExcelIO.IO(); // ExcelIO 객체 생성

				// Excel 데이터를 Workbook으로 로드
				excelIO.open(
					arrayBuffer,
					function (workbook) {
						console.log('workbook', workbook);
						const spread = spreadInstance.current;
						spread.fromJSON(workbook); // SpreadSheets에 데이터 반영

						for (let i = 0; i < spread.sheets.length; i++) {
							const sheet = spread.sheets[i];
							const pictures = workbook.sheets[sheet.name()].shapes || []; // 시트의 이미지 정보 가져오기

							pictures.forEach((picture) => {
								const { name, x, y, width, height } = picture;
								const data = picture.shapeData.pic.blipFill.blip.blipBlob.blob;
								sheet.pictures.add(name, data, x, y, width, height);
							});
						}
					},
					function (error) {
						console.error(error);
					},
				);
			};
			reader.readAsArrayBuffer(blob);
		}
	}, [base64Data]);

	return (
		<div>
			<SpreadSheets
				hostStyle={hostStyle}
				workbookInitialized={(spread) => (spreadInstance.current = spread)} // SpreadSheets 인스턴스를 저장
			/>
		</div>
	);
}
