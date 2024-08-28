import { atom } from 'recoil';
import { navContentList } from '../Common/string';

export const SelectedNavContent = atom<string>({
	key: 'SelectedNavContent',
	default: navContentList.recents,
});
