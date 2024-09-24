import React from 'react';
import * as GC from '@grapecity/spread-sheets';
import { SpreadSheets } from '@grapecity/spread-sheets-react';
import '@grapecity/spread-sheets/styles/gc.spread.sheets.excel2013white.css';

const hostStyle = {
	width: '100%',
	height: '100%',
};

export default function SpreadJS() {
	return (
		<div>
			<SpreadSheets
				hostStyle={hostStyle}
				workbookInitialized={(spread) => this.initSpread(spread)}
			></SpreadSheets>
		</div>
	);
}
