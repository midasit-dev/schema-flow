import React from 'react';
import { Panel, useReactFlow, getNodesBounds, getViewportForBounds } from '@xyflow/react';
import { toBlob } from 'html-to-image';

const imageWidth = 1024;
const imageHeight = 768;
const padding = 20; // 추가적인 여유 공간을 위한 패딩

function saveBlobAsFile(blob, filename) {
	// Blob을 URL로 변환합니다.
	const url = URL.createObjectURL(blob);

	// a 태그를 생성하여 다운로드를 트리거합니다.
	const a = document.createElement('a');
	a.href = url;
	a.download = filename;

	// 링크 클릭으로 파일 다운로드를 실행합니다.
	document.body.appendChild(a);
	a.click();

	// 다운로드 후 링크와 URL을 해제합니다.
	document.body.removeChild(a);
	URL.revokeObjectURL(url);
}

function uploadImageToServer(blob) {
	const formData = new FormData();
	formData.append('image', blob, 'reactflow.png');

	fetch('https://your-server-endpoint/upload', {
		method: 'POST',
		body: formData,
	})
		.then((response) => response.json())
		.then((data) => {
			console.log('Server response:', data);
		})
		.catch((error) => {
			console.error('Error uploading image:', error);
		});
}

function DownloadButton() {
	const { getNodes } = useReactFlow();
	const onClick = () => {
		const nodesBounds = getNodesBounds(getNodes());

		// 노드 경계 크기에 맞추어 뷰포트 크기 및 위치 설정
		const customWidth = Math.max(imageWidth, nodesBounds.width);
		const customHeight = Math.max(imageHeight, nodesBounds.height);

		const viewport = {
			x: nodesBounds.x,
			y: nodesBounds.y,
			width: customWidth,
			height: customHeight,
		};

		toBlob(document.querySelector('.react-flow__viewport'), {
			backgroundColor: '#FFF',
			width: viewport.width,
			height: viewport.height,
			// style: {
			// 	width: `${viewport.width}px`,
			// 	height: `${viewport.height}px`,
			// 	position: 'absolute',
			// 	left: `${-viewport.x}px`,
			// 	top: `${-viewport.y}px`,
			// 	overflow: 'visible',
			// },
			useCors: true,
		}).then((blob) => {
			if (blob) {
				saveBlobAsFile(blob, 'reactflow.png');
				// uploadImageToServer(blob);
			} else {
				console.error('Blob creation failed');
			}
		});
	};

	return (
		<Panel position='top-right'>
			<button className='download-btn' onClick={onClick}>
				Download and Upload Image
			</button>
		</Panel>
	);
}

export default DownloadButton;
