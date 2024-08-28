import * as React from 'react';
import { useNightSight } from './useThemeSetting';

/**
 * NightSightSwitch
 * @param {*} props
 * @returns
 */

export default function NightSightSwitch() {
	const { darkMode, toggleDarkMode } = useNightSight();

	const handleOnChange = React.useCallback(
		(e) => {
			toggleDarkMode(e.target.checked);
		},
		[toggleDarkMode],
	);

	return (
		<React.Fragment>
			<label className='container' style={{ margin: '4px' }}>
				<input
					type='checkbox'
					id='toggle'
					checked={darkMode.mode === 'dark'}
					onChange={handleOnChange}
				/>
				<span className='slider round'>
					<div className='background'></div>
					<div className='star'></div>
					<div className='star'></div>
				</span>
			</label>
			<style>
				{`
					:root{
						--
						--dark: #111111;
						--sun: #ffd700;
						--sun-shadow: #987416;
						--moon: #dddddd;
						--moon-shadow: #808080;
						--star: #FFEA00;
						--cloud: #fefefe;
						--crater: #535370;
						--shadow-01: #80808077;
						--shadow-02: #ffffff22;
						--shadow-03: #555555;
						--white: #fefefe;
						--border-day: #C4C6C8;
						--background-day: linear-gradient(skyblue, cadetblue);
						--background-night: linear-gradient(-45deg, #222, #000030);
					}

					.dark{
						background: var(--dark);
					}

					.container{
						position: relative;
						display: inline-block;
						width: 32px;
						height: 16px;
					}

					.container input{
						opacity: 0;
						width: 0;
						height: 0;
					}

					.slider{
						position: absolute;
						cursor: pointer;
						inset: 0;
						background: var(--background-day);
						-webkit-transition: 0.4s;
						transition: 0.4s;

						border: 1px solid var(--border-day);

						overflow: hidden;
						z-index: 1;
					}

					.slider::before{
						position: absolute;
						content: "";
						height: 11.5px;
						width: 11.5px;
						left: 1px;
						top: 1.5px;
						background-color: var(--sun);
						-webkit-transition: 0.4s;
						transition: 0.4s;
						box-shadow:
							inset 0 -1px 2px var(--sun-shadow),
							0 1px 2px var(--shadow-01),
							0 0 0 10px var(--shadow-02),
							0 0 0 20px var(--shadow-02),
							10px 0 0 20px var(--shadow-02);
					}
						
					input:checked + .slider{
						background: var(--background-night);
						border: 1px solid var(--background-night);
					}

					input:checked + .slider:before{
						background: var(--moon);
						top: 2px;
						-webkit-transform: translateX(150%);
						-ms-transform: translateX(150%);
						transform: translateX(150%);
						box-shadow:
							inset 0 -1px 2px var(--moon-shadow),
							0 1px 2px var(--shadow-03),
							0 0 0 10px var(--shadow-02),
							0 0 0 20px var(--shadow-02),
							-10px 0 0 20px var(--shadow-02);
					}

					.slider::after{
						content: "";
						position: absolute;
						background: var(--crater);
						width: 2px;
						height: 2px;
						border-radius: 50%;
						bottom: 52.5%;
						right: 20%;
						box-shadow:
							-8px 7px 0 3px var(--crater),
							2px 10px 0 var(--crater)
						;
						-webkit-transition: .4s;
						transition: .4s;
						-webkit-transform: scale(0) rotate(360deg);
						transform: scale(0) rotate(360deg);
						filter: saturate(.75);
					}

					input:checked + .slider::after{
						-webkit-transform: scale(.5) rotate(-24deg);
						transform: scale(.5) rotate(-24deg);
					}

					input:checked + .slider .background{
						-webkit-transform: translateY(260%);
						transform: translateY(260%);
						opacity: 0;
					}

					.star{
						-webkit-transform: scale(0);
						transform: scale(0);
						-webkit-transition: .4s;
						transition: .4s;
					}

					input:checked + .slider .star{
						position: absolute;
						width: 0;
						height: 0;
						border: 10px solid transparent;
						border-bottom: 7px solid var(--star);
						transform: rotate(35deg);
						border-top: none;
						margin: 2.5px 0;
						-webkit-transform: scale(.2) translate(-100%, -50%);
						transform: scale(.2) translate(-100%, -50%);
					}

					input:checked + .slider .star:last-child{
						-webkit-transform: scale(.3) translate(25%, 150%);
						transform: scale(.3) translate(25%, 150%);
					}

					input:checked + .slider .star::before,
					input:checked + .slider .star::after{
						content: "";
						position: absolute;
						width: 0;
						height: 0;
						border-top: none;
					}

					input:checked + .slider .star::before{
						border: 3px solid transparent;
						border-bottom: 8px solid var(--star);
						-webkit-transform: rotate(35deg);
						transform: rotate(35deg);
						top: -7.5px;
						left: 1.5px;
					}

					input:checked + .slider .star::after{
						border: 10px solid transparent;
						border-bottom: 7px solid var(--star);
						-webkit-transform: rotate(70deg);
						transform: rotate(70deg);
						top: -7px;
						left: -4.5px;
					}

					.slider.round {
						border-radius: 34px;
					}
					.slider.round:before {
						border-radius: 50%;
					}
					.background{
						position: absolute;
						width: 5px;
						height: 5px;
						background: var(--cloud);
						border-radius: 50%;
						bottom: 0;
						right: -10px;
						box-shadow:
							-5px -7px 0 3px var(--cloud),
							-13px 0px 0 5px var(--cloud),
							-37px 4px 0 3px var(--cloud),
							-25px 2px 0 5px var(--cloud)
						;
						-webkit-transition: .4s;
						transition: .4s;
					}
				`}
			</style>
		</React.Fragment>
	);
}
