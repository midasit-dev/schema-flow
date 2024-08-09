import React, { useState } from 'react';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm'; // 추가된 플러그인
import rehypeRaw from 'rehype-raw';
import ReactMD, { defaultUrlTransform } from 'react-markdown';
import 'katex/dist/katex.min.css';
import { GuideBox } from '@midasit-dev/moaui-components-v1';

export default function MarkdownViewer(props) {
	const [scale, setScale] = useState(1); // 확대/축소 비율을 상태로 관리

	const handleWheel = (event) => {
		if (event.ctrlKey) {
			// Ctrl 키가 눌렸을 때만 확대/축소
			event.preventDefault(); // 기본 휠 동작 방지 (예: 페이지 스크롤)
			if (event.deltaY < 0) {
				setScale((prevScale) => Math.min(prevScale + 0.1, 3)); // 최대 3배 확대
			} else {
				setScale((prevScale) => Math.max(prevScale - 0.1, 0.5)); // 최소 0.5배 축소
			}
		}
	};

	return (
		<GuideBox
			style={{ padding: '20px', transform: `scale(${scale})`, transformOrigin: '0 0' }}
			onWheel={handleWheel} // 마우스 휠 이벤트 핸들러
		>
			<ReactMD
				remarkPlugins={[remarkMath, remarkGfm]} // remark-gfm 추가
				rehypePlugins={[rehypeKatex, rehypeRaw]}
				urlTransform={(url, key, node) => {
					if (node.tagName === 'img' && url.startsWith('data:image')) {
						return url; // data:image URL을 직접 반환
					} else {
						return defaultUrlTransform(url); // 기본 URL 변환
					}
				}}
				components={{
					table: ({ children }) => (
						<table style={{ width: '60%', borderCollapse: 'collapse' }}>{children}</table>
					),
					th: ({ children }) => (
						<th style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f2f2f2' }}>
							{children}
						</th>
					),
					td: ({ children }) => (
						<td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>
							{children}
						</td>
					),
					tr: ({ children }) => <tr style={{ borderBottom: '1px solid #ddd' }}>{children}</tr>,
				}}
			>
				{props['mdData']}
			</ReactMD>
			<style>
				{`
                    h1 {
                        font-size: 2.5rem;
                        font-weight: 600;
                    }

                    h2 {
                        font-size: 2rem;
                        font-weight: 600;
                    }

                    h3 {
                        font-size: 1.75rem;
                        font-weight: 600;
                    }

                    h4 {
                        font-size: 1.5rem;
                        font-weight: 600;
                    }

                    h5 {
                        font-size: 1.25rem;
                        font-weight: 600;
                    }

                    h6 {
                        font-size: 1rem;
                        font-weight: 600;
                    }

                    p, ul {
                        font-size: 1.25rem;
                    }

                    table {
                        width: 100%;
                        margin: 1rem 0;
                        font-size: 1.25rem;
                    }

                    th, td {
                        border: 1px solid #ddd;
                        padding: 12px;
                        text-align: left;
                    }

                    th {
                        background-color: #f2f2f2;
                    }

                    tr:nth-child(even) {
                        background-color: #f9f9f9;
                    }

                    tr:hover {
                        background-color: #f1f1f1;
                    }

                    body {
                        font-family: 'Arial', sans-serif;
                    }
                `}
			</style>
		</GuideBox>
	);
}
