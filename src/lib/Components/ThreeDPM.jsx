import React from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { Delaunay } from 'd3-delaunay';
import { ConvexGeometry } from 'three/examples/jsm/geometries/ConvexGeometry';

const scale = 600;

function DataLine({ meshData, strength, lcbs }) {
	const meshRef = React.useRef();

	// 데이터 포인트를 정규화하여 THREE.Vector3 배열로 변환합니다.
	const points = meshData.map(([x, y, z]) => new THREE.Vector3(x / scale, y / scale, z / scale));

	// ConvexGeometry를 사용하여 포인트들로부터 외곽 표면을 생성합니다.
	const geometry = new ConvexGeometry(points);

	// 메쉬의 소재를 설정합니다 (투명하고 색상 없음).
	const meshMaterial = new THREE.MeshBasicMaterial({
		color: 0xffffff, // 기본 색상 (하얀색)
		opacity: 0.5, // 투명도 (0.0: 완전히 투명, 1.0: 불투명)
		transparent: true, // 투명도 설정을 활성화
		side: THREE.DoubleSide, // 양면 모두 렌더링
	});

	// 엣지의 소재를 설정합니다 (엣지 선).
	const edgeMaterial = new THREE.LineBasicMaterial({
		color: 0x000000, // 엣지 선 색상 (검정색)
		linewidth: 2, // 엣지 선의 두께
	});

	// ConvexGeometry로부터 엣지 지오메트리를 생성합니다.
	const edgesGeometry = new THREE.EdgesGeometry(geometry);

	// 메쉬와 엣지를 각각 생성합니다.
	const mesh = new THREE.Mesh(geometry, meshMaterial);
	const edges = new THREE.LineSegments(edgesGeometry, edgeMaterial);

	// strength 포인트를 렌더링하기 위한 설정
	const strengthPointGeometry = new THREE.BufferGeometry();
	const strengthPointMaterial = new THREE.PointsMaterial({
		color: 0x0000ff, // 포인트 색상 (파란색)
		size: 0.04, // 포인트의 크기
	});

	// strength 포인트를 THREE.Vector3 배열로 변환
	const strengthPoints = strength.map(
		([x, y, z]) => new THREE.Vector3(x / scale, y / scale, z / scale),
	);
	strengthPointGeometry.setFromPoints(strengthPoints);

	// Points 객체를 생성
	const strengthPointsMesh = new THREE.Points(strengthPointGeometry, strengthPointMaterial);

	// lcbs 포인트를 렌더링하기 위한 설정
	const lcbsPointGeometry = new THREE.BufferGeometry();
	const lcbsPointMaterial = new THREE.PointsMaterial({
		color: 0xff0000, // 포인트 색상 (빨간색)
		size: 0.04, // 포인트의 크기
	});

	// lcbs 포인트를 THREE.Vector3 배열로 변환
	const lcbsPoints = lcbs.map(([x, y, z]) => new THREE.Vector3(x / scale, y / scale, z / scale));
	lcbsPointGeometry.setFromPoints(lcbsPoints);

	// Points 객체를 생성
	const lcbsPointsMesh = new THREE.Points(lcbsPointGeometry, lcbsPointMaterial);

	const lines = [];
	const lineMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 }); // 선 색상 (빨간색)

	for (let i = 0; i < strength.length; i++) {
		if (strength[i] && lcbs[i]) {
			const linePoints = [
				new THREE.Vector3(0, 0, 0),
				new THREE.Vector3(strength[i][0] / scale, strength[i][1] / scale, strength[i][2] / scale),
				new THREE.Vector3(lcbs[i][0] / scale, lcbs[i][1] / scale, lcbs[i][2] / scale),
			];

			const lineGeometry = new THREE.BufferGeometry().setFromPoints(linePoints);
			const line = new THREE.Line(lineGeometry, lineMaterial);
			lines.push(line);
		}
	}

	return (
		<group ref={meshRef}>
			<primitive object={mesh} />
			<primitive object={edges} />
			<primitive object={strengthPointsMesh} />
			<primitive object={lcbsPointsMesh} />
			{lines.map((line, index) => (
				<primitive key={index} object={line} />
			))}
		</group>
	);
}

function reCalculateData(data, strength, lcbs) {
	const newData = data.map((d) => {
		const x = d.Mx;
		const y = d.My;
		const z = d.Nz;
		return [x * Math.pow(10, -6), z / 10000, y * Math.pow(10, -6)];
	});

	const newlcb = lcbs.map((d) => {
		const x = d.f.Mx;
		const y = d.f.My;
		const z = d.f.Nz;
		return [x * Math.pow(10, -6), z / 10000, y * Math.pow(10, -6)];
	});

	const newstre = strength.map((d) => {
		const x = d.f.Mx;
		const y = d.f.My;
		const z = d.f.Nz;
		return [x * Math.pow(10, -6), z / 10000, y * Math.pow(10, -6)];
	});
	return { newData, newstre, newlcb };
}

function ThreeDPM(props) {
	const { mesh3dpm = {} } = props['data'] || {};
	const { lcbs = {} } = props['data'] || {};
	const { strength = {} } = props['data'] || {};
	const [Data, setNewData] = React.useState({
		newData: [
			[0.00032639995659142733, 2.2351741790771485e-14, -573.998955056804],
			[2, 2, 2],
		],
		newstre: [],
		newlcb: [],
	});
	React.useEffect(
		() => {
			if (mesh3dpm.length === 0) return;
			if (strength.length === 0) return;
			if (lcbs.length === 0) return;
			const { newData, newstre, newlcb } = reCalculateData(mesh3dpm, strength, lcbs);
			setNewData({ newData, newstre, newlcb });
		},
		[mesh3dpm],
		[strength],
		[lcbs],
	);

	return (
		<div style={{ width: '100%', height: '100%', marginRight: '20px' }}>
			<Canvas>
				<ambientLight intensity={0.5} />
				<spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
				<pointLight position={[10, 10, 10]} />
				<DataLine meshData={Data.newData} strength={Data.newstre} lcbs={Data.newlcb} />
				<axesHelper args={[10]} />
				<OrbitControls />
			</Canvas>
		</div>
	);
}

export default ThreeDPM;
