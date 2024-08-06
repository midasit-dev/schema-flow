import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import ReactMD, { defaultUrlTransform } from 'react-markdown';
import 'katex/dist/katex.min.css';
import { GuideBox } from '@midasit-dev/moaui-components-v1';

const text = "";

export default function MarkdownViewer(props) {
	return (
		<GuideBox>
			{/* <ReactMD remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
				{text}
			</ReactMD> */}
			<ReactMD
				remarkPlugins={[remarkMath]}
				rehypePlugins={[rehypeKatex]}
				urlTransform={(url, key, node) => {
					if (node.tagName === 'img' && url.startsWith('data:image')) return url;
					else defaultUrlTransform(url);
				}}
			>
				{props['mdData']}
			</ReactMD>
			<style>
				{`
					h1 {
						font-size: 1.5rem;
						font-weight: 600;
					}

					h2 {
						font-size: 1.25rem;
						font-weight: 600;
					}

					h3 {
						font-size: 1.125rem;
						font-weight: 600;
					}

					h4 {
						font-size: 1rem;
						font-weight: 600;
					}

					h5 {
						font-size: 0.875rem;
						font-weight: 600;
					}

					h6 {
						font-size: 0.75rem;
						font-weight: 600;
					}

					p {
						font-size: 0.8rem;
					}

					ul {
						font-size: 0.8rem;
					}

					br {
						margin: 1;
					}
				`}
			</style>
		</GuideBox>
	);
}
