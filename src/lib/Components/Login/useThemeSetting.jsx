import * as React from 'react';

export function useThemeFunction() {
	const [darkMode, _setDarkMode] = React.useState({
		followSystem: true,
		mode:
			window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
				? 'dark'
				: 'light',
	});

	const setDarkMode = React.useCallback((value) => {
		if (value instanceof Function) {
			_setDarkMode((prev) => {
				const result = value(prev);
				localStorage.setItem('prefers-dark-mode', JSON.stringify(result));
				return result;
			});
		} else {
			localStorage.setItem('prefers-dark-mode', JSON.stringify(value));
			_setDarkMode(value);
		}
	}, []);

	const handleThemeChange = React.useCallback(() => {
		const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
		setDarkMode((prev) => {
			if (prev.followSystem)
				return {
					...prev,
					mode: mediaQuery.matches ? 'dark' : 'light',
				};
			else return prev;
		});
	}, [setDarkMode]);

	React.useEffect(() => {
		const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
		const lsItem = localStorage.getItem('prefers-dark-mode');
		if (lsItem !== null) {
			try {
				const userPrefer = JSON.parse(lsItem);
				if (!userPrefer?.followSystem) {
					setDarkMode(userPrefer);
				}
			} catch {}
		}

		mediaQuery.addEventListener('change', handleThemeChange);
		return () => mediaQuery.removeEventListener('change', handleThemeChange);
	}, [setDarkMode, handleThemeChange]);

	const toggleDarkMode = React.useCallback(
		(value) => {
			setDarkMode((prev) => ({
				...prev,
				mode: value ? 'dark' : 'light',
				followSystem: false,
			}));
		},
		[setDarkMode],
	);

	const toggleFollowSystem = React.useCallback(() => {
		setDarkMode((prev) => {
			const flipDefault = {
				...prev,
				followSystem: !prev.followSystem,
			};

			const localStorageItem = localStorage.getItem('prefers-dark-mode');
			if (localStorageItem === null) return flipDefault;

			let userPrefer = JSON.parse(localStorageItem);
			if (userPrefer) {
				return {
					...flipDefault,
					mode: userPrefer?.mode || 'light',
				};
			}
			return flipDefault;
		});
	}, [setDarkMode]);

	return { darkMode, toggleDarkMode, toggleFollowSystem };
}

const NightSightCtx = React.createContext(undefined);
export const useNightSight = () => {
	const tf = React.useContext(NightSightCtx);
	if (!tf) throw new Error('useNightSight must be used within a NightSightProvider');

	return tf;
};

export function NightSightProvider(props) {
	const tf = useThemeFunction();
	const tfMemo = React.useMemo(() => tf, [tf]);

	return <NightSightCtx.Provider value={tfMemo}>{props.children}</NightSightCtx.Provider>;
}

export default NightSightProvider;
