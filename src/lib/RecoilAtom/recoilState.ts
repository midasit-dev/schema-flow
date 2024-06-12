import { atom, selector } from 'recoil';

export const SelectedSchema = atom<any>({
	key: 'SelectedSchema',
	default: {},
});

export const Nodetypes = atom<any>({
	key: 'Nodetypes',
	default: {},
});

export const isClickedlist = atom<any>({
	key: 'isClickedlist',
	default: [],
});
