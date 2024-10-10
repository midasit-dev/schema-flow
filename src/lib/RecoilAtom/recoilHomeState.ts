import { atom } from 'recoil';
import { navContentList } from '../Common/string';
import rss from 'react-secure-storage';

export const SelectedNavContent = atom<string>({
	key: 'SelectedNavContent',
	default: navContentList.recents,
});

export const TokenState = atom<string>({
	key: 'token',
	default: (rss.getItem('token') as string) || '',

	// when local storage token value is changed, update the token state
	effects_UNSTABLE: [
		({ setSelf, onSet }) => {
			const token = rss.getItem('token') as string;
			if (token) {
				setSelf(token);
			}

			onSet((newValue) => {
				rss.setItem('token', newValue);
			});
		},
	],
});

export const AccState = atom<string>({
	key: 'acc',
	default: JSON.parse(rss.getItem('acc') as string) || { id: '', pwd: '' },

	// when local storage acc value is changed, update the acc state
	effects_UNSTABLE: [
		({ setSelf, onSet }) => {
			const acc = rss.getItem('acc') as string;
			if (acc) {
				setSelf(JSON.parse(acc));
			}

			onSet((newValue) => {
				rss.setItem('acc', JSON.stringify(newValue));
			});
		},
	],
});
