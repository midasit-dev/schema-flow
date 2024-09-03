import React from 'react';
import { Panel, useReactFlow, getNodesBounds, getViewportForBounds } from '@xyflow/react';
import { toBlob } from 'html-to-image';

const imageWidth = 1024;
const imageHeight = 768;
const padding = 20; // 추가적인 여유 공간을 위한 패딩

function saveBlobAsFile(blob, filename) {
	console.log('blob', blob);
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
	formData.append('Thumbnail', blob, 'Thumbnail.png');

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

		const viewport = getViewportForBounds(nodesBounds, imageWidth, imageHeight, 0.5, 2);

		toBlob(document.querySelector('.react-flow__viewport'), {
			backgroundColor: '#FFF',
			width: viewport.width,
			height: viewport.height,
			style: {
				width: imageWidth,
				height: imageHeight,
				transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
			},
			useCors: true,
		}).then((blob) => {
			if (blob) {
				saveBlobAsFile(blob, 'reactflow.png');
				console.log('blob', blob);
				// uploadImageToServer(blob);
			} else {
				console.error('Blob creation failed');
			}
		});
	};

	return (
		<Panel position='top-right'>
			<button className='download-btn' onClick={onClick}>
				Download Image
			</button>
		</Panel>
	);
}

export default DownloadButton;
