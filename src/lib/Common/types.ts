/**
 * {
 * 		type: {
 * 			type: 'string',
 * 			description: 'UI 요소의 종류 (예: "Button", "Input", "Form", 등)'
 * 		},
 * 		props: {
 * 			type: 'object',
 * 			description: 'UI 요소에 전달되는 속성들',
 * 			properties: {
 * 				// 여기에 해당 UI 요소의 속성을 정의합니다.
 * 			}
 * 		},
 * 		children: {
 * 			type: 'array',
 * 			description: '하위 UI 요소들',
 * 			items: {
 * 				type: 'object',
 * 				$ref: '#'
 * 			}
 * 		}
 * }
 *
 * @typedef {Object} Layer
 * @property {string} type - UI 요소의 종류 (예: 'Button', 'Input', 'Form', 등)
 * @property {Object} props - UI 요소에 전달되는 속성들
 * @property {Array<Layers>} children - 하위 UI 요소들
 */
interface Layer {
	id: string;
	type: string; //AvailableComponents.ts 참고
	props: Record<string, any>;
	children?: Array<Layer>;
}

interface Layers extends Array<Layer> {}

interface Canvas {
	width: number;
	height: number;
}

interface ExportSchema {
	canvas?: Canvas;
	layers?: Layers;
	python?: Python;
}

interface LayoutSchema {
	id: string;
	x: number;
	y: number;
	width: number;
	height: number;
	parent?: string | null;
}

interface LayoutSchemas extends Array<LayoutSchema> {}

type ControllerInputs = {
	x: number;
	y: number;
	width: number;
	height: number;
	spacing: number;
};

interface Box {
	id: string;
	element: JSX.Element;
}

interface Schema {
	canvas?: Canvas;
	layers?: Layers;
	python?: Python;
}

interface Python {
	rawCode: string;
	pySchema: PySchemaContainer;
	argumentComponent: object;
}

interface PySchemaContainer {
	schema: PySchema;
	topK?: number;
}

interface PySchema {
	name: string;
	parameters: object;
	description: string;
}
interface PlaygroundProps {
	schema?: Schema;
	onChange?: (schema: Schema) => void;
	secure?: SecureInfo;
}

interface SecureInfo {
	authApiEndpoint: string;
	userIdentifier: string;
	getAiResponse: AiResponse;
	getAiSchemaCode: AiSchemaCode;
}

interface AiResponse {
	(value: string): string;
}

interface AiSchemaCode {
	(threadId: string | number, functionId: string | number): string;
}

interface ExportCodes {
	tsx?: string;
	py?: string;
}

interface BasicUISchema {
	id: string;
	type: string;
	props: any;
	children: any;
	parent: any;
}

interface ConvertResult {
	uiSchema: uiSchema;
	pyArgumentComponent: object;
}

interface uiSchema {
	canvas: Canvas;
	layers: Layers;
}

interface Undo {
	layers: Layers;
	selectedLayerId: string;
}

interface Redo {
	layers: Layers;
	selectedLayerId: string;
}
interface UndoRedoLayers {
	undo: Undo[];
	redo: Redo[];
}

export type {
	LayoutSchema,
	LayoutSchemas,
	ControllerInputs,
	Layer,
	Layers,
	Canvas,
	ExportSchema,
	Box,
	Schema,
	PlaygroundProps,
	ExportCodes,
	BasicUISchema,
	ConvertResult,
	Python,
	PySchemaContainer,
	PySchema,
	SecureInfo,
	UndoRedoLayers,
	Undo,
	Redo,
};
