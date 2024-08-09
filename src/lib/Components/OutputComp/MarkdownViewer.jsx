import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm'; // 추가된 플러그인
import rehypeRaw from 'rehype-raw';
import ReactMD, { defaultUrlTransform } from 'react-markdown';
import 'katex/dist/katex.min.css';
import { GuideBox } from '@midasit-dev/moaui-components-v1';

export default function MarkdownViewer(props) {
	return (
		<GuideBox>
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
						<table style={{ width: '100%', borderCollapse: 'collapse' }}>{children}</table>
					),
					th: ({ children }) => (
						<th style={{ border: '1px solid #ddd', padding: '12px', backgroundColor: '#f2f2f2' }}>
							{children}
						</th>
					),
					td: ({ children }) => (
						<td style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>
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
