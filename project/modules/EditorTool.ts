/// <reference path='..\types\DefinitelyTyped\node\node.d.ts'/>
/// <reference path='..\types\DefinitelyTyped\express\express.d.ts'/>
/// <reference path='..\types\DefinitelyTyped\mongodb\mongodb.d.ts'/>


import mongodb = require('mongodb');

    export interface Tool{
        toolName: string;
    }    
    
    export class SpeechBubbleTool implements Tool{
        toolName: string;
        displaySpeechBubbleTool = function(){
            
        };
    }
