import React from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

const scale = 600;

function DataPoints(props) {
	const { newData } = props;
	const meshRef = React.useRef();

	// Optional: Animate the data points (e.g., rotation)
	useFrame(() => {
		if (meshRef.current) {
			meshRef.current.rotation.y += 0.01;
		}
	});

	return (
		<>
			<group ref={meshRef}>
				{newData.map(([x, y, z], index) => (
					<mesh key={index} position={[x / scale, y / scale, z / scale]}>
						<sphereGeometry args={[0.01, 32, 32]} />
						<meshStandardMaterial color={'black'} />
					</mesh>
				))}
			</group>
		</>
	);
}

function DataLine({ newData }) {
	const lineRef = React.useRef();

	// 선을 그리기 위한 점들을 정의합니다.
	const points = newData.map(([x, y, z]) => new THREE.Vector3(x / scale, y / scale, z / scale));
	// BufferGeometry를 이용해 선의 경로를 설정합니다.
	const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
	// LineBasicMaterial로 선의 소재를 정의합니다.

	// 색상 배열을 생성하고 각 점에 대한 색상 설정
	const colors = [];
	for (let i = 0; i < points.length; i++) {
		const color = new THREE.Color();
		// 선의 위에서 아래로 색상 그라데이션 적용
		// 예를 들어 시작점은 빨간색에서 파란색으로 변화
		color.setHSL(i / points.length, 1.0, 0.5);
		colors.push(color.r, color.g, color.b);
	}
	lineGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

	const lineMaterial = new THREE.LineBasicMaterial({
		vertexColors: true, // 점의 색상 사용을 활성화
	});

	// Line 객체를 생성하여 선을 생성합니다.
	const line = new THREE.Line(lineGeometry, lineMaterial);

	// useFrame을 이용한 애니메이션 효과 추가
	useFrame(() => {
		if (lineRef.current) {
			// 예를 들어 선의 Y축을 중심으로 회전시킵니다.
			lineRef.current.rotation.y += 0.01;
		}
	});

	return <primitive object={line} ref={lineRef} />;
}

function reCalculateData(data) {
	const newData = data.map((d) => {
		const x = d.Mx;
		const y= d.My;
		const z = d.Nz;
		return [x * Math.pow(10, -6), z / 10000, y * Math.pow(10, -6)];
	});
	return newData;
}

function ThreeDPM(props) {
	const { data = [''] } = props;
	const [newData, setNewData] = React.useState([
		[0.00032639995659142733, 2.2351741790771485e-14, -573.998955056804],
		[2, 2, 2],
	]);
	React.useEffect(() => {
		if (data.length === 0) return;
		const newData = reCalculateData(data);
		setNewData(newData);
	}, [data]);

	return (
		<div style={{ width: '100%', height: '100%', marginRight: '20px' }}>
			<Canvas>
				<ambientLight intensity={0.5} />
				<spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
				<pointLight position={[10, 10, 10]} />
				<DataPoints newData={newData} />
				<DataLine newData={newData} />
				<axesHelper args={[10]} />
				<OrbitControls />
			</Canvas>
		</div>
	);
}

export default ThreeDPM;
