/// <reference path='..\types\DefinitelyTyped\node\node.d.ts'/>
/// <reference path='..\types\DefinitelyTyped\express\express.d.ts'/>
/// <reference path='..\types\DefinitelyTyped\mongodb\mongodb.d.ts'/>

// jqueryui might be useful for anything that fabricjs can't do
/// <reference path='..\types\DefinitelyTyped\jquery\jquery.d.ts'/>
/// <reference path='..\types\DefinitelyTyped\jqueryui\jqueryui.d.ts'/>

/// <reference path='..\types\DefinitelyTyped\fabricjs\fabricjs.d.ts'/>

import mongodb = require('mongodb');

export interface Tool {
    toolName: string;
}    
    
export class RotateTool implements Tool{
    toolName: string;

    RotateTool = function(){
            
    };
}
