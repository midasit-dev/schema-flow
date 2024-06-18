import { atom } from 'recoil';

export const SelectedSchema = atom<any>({
	key: 'SelectedSchema',
	default: {},
});

export const Nodetypes = atom<any>({
	key: 'Nodetypes',
	default: {},
});

export const FunctionListInfo = atom<any>({
	key: 'FunctionListInfo',
	default: [],
	// [
	// 	{
	// 		id : 1
	// 		name : 'Function Name'
	// 		schema : {}
	// 		isSelected : false
	// 		isRendered : false
	// 		viewCount : 0
	// 	}
	// ]
});

export const RJSFdimension = atom<any>({
	key: 'RJSFdimension',
	default: {},
});
