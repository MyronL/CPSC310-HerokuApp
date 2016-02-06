/// <reference path='..\types\DefinitelyTyped\node\node.d.ts'/>
/// <reference path='..\types\DefinitelyTyped\express\express.d.ts'/>
/// <reference path='..\types\DefinitelyTyped\mongodb\mongodb.d.ts'/>

//jqueryui might be useful for anything that fabricjs can't do
/// <reference path='..\types\DefinitelyTyped\jquery\jquery.d.ts'/>
/// <reference path='..\types\DefinitelyTyped\jqueryui\jqueryui.d.ts'/>

/// <reference path='..\types\DefinitelyTyped\fabricjs\fabricjs.d.ts'/>

import mongodb = require('mongodb');

export interface Speech {

	// allows user to edit the text
	editText();

}

export class Bubble implements Speech {
	private text: string;
	//private image: sometype;

	constructor(){

		this.text = "";
		// placeholderthis.image = null;
	}

	editText() {
		// somehow take in keybaord commands
		
	}

}