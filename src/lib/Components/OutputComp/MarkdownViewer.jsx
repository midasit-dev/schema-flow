import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import ReactMD from 'react-markdown';
import 'katex/dist/katex.min.css'
import { GuideBox } from '@midasit-dev/moaui';

const text = `
# System Information
Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 Edg/124.0.0.0 host:MIDAS.MCVL/x64.9.5.0.Debug

# AI Summary
*아래는 AI 요약 필드입니다. 요약이 부정확할 수 있으니 채팅 기록을 확인하세요.*
 문제: CIVIL NX에서 해석이 수행되지 않는 상황입니다.

해결책:
1. 모델링 오류, 재료 속성, 경계 조건 확인
2. CIVIL NX 최신 버전으로 업데이트
3. 자세한 정보(사용 버전, 오류 메시지 등) 제공 요청

위의 해결책을 시도하고 문제가 지속되면 더 자세한 도움을 받을 수 있습니다.

# Chat History

|Role|ID|
|------|---|
| User      | "NEW_CELL" |
\`\`\`
CIVIL NX에서 해석이 안됩니다.
\`\`\`

|Role|ID|
|------|---|
| Assistant | {"cellId":"01HYJ6BJXD1FJWANEWKFQN8KGC"} |
\`\`\`
안녕하세요, 마이다스아이티 기술서포터입니다.

문제: CIVIL NX에서 해석이 수행되지 않음.

해당 문제의 경우, 명확한 상황 설명이 없어 정확한 답변을 드리기 어렵습니다. 하지만, 해석이 수행되지 않는 일반적인 원인으로는 모델링 오류, 재료 속성 미정의, 경계 조건 설정 오류 등이 있을 수 있습니다. 우선 [File > Check Model] 기능을 사용하여 모델에 오류가 있는지 확인해보시기 바랍니다. 또한, 사용 중인 CIVIL NX의 버전을 확인하고 최신 버전으로 업데이트하는 것도 해결책이 될 수 있습니다. 만약 문제가 지속된다면, 더 자세한 정보(사용 버전, 발생하는 오류 메시지 등)를 제공해주시면 보다 구체적으로 도와드릴 수 있습니다.

[요약]
- 모델링 오류, 재료 속성, 경계 조건 확인
- CIVIL NX 최신 버전으로 업데이트
- 자세한 정보 제공 요청

[키워드] CIVIL NX, 해석 안됨, 모델링 오류, 버전 업데이트, 기술 지원
\`\`\`
`;

export default function MarkdownViewer({ mdData = "" }) {
  return(
		<GuideBox>
			<ReactMD
				remarkPlugins={[remarkMath]}
				rehypePlugins={[rehypeKatex]}
			>
				{mdData}
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
  )

}