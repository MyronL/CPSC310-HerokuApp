/// <reference path='..\types\DefinitelyTyped\node\node.d.ts'/>
/// <reference path='..\types\DefinitelyTyped\express\express.d.ts'/>
/// <reference path='..\types\DefinitelyTyped\mongodb\mongodb.d.ts'/>


import mongodb = require('mongodb');


    export interface PanelItem{
        _id: mongodb.ObjectID;
        URI: string;
        inPanel: number;
        xlocation: number;
        ylocation: number;
    }
        
    export class UploadedImage implements PanelItem{
        _id: mongodb.ObjectID;
        URI: string;
        inPanel: number;
        xlocation: number;
        ylocation: number;
    }
    
    export class SpeechBubble implements PanelItem{
        _id: mongodb.ObjectID;
        URI: string;
        inPanel: number;
        xlocation: number;
        ylocation: number;
        text: string;
    }

    export class Panel{
        private panelNumber: number;
        private images: UploadedImage[];
        private speechBubbles: SpeechBubble[];
    }
    
   export class Comic{
        private title: string;
        private author: string;
        private description: string;
        private tags: string[];
        private panels: Panel[];
        private thumbnailURI: string;
    }
 

