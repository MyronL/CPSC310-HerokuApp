/// <reference path='..\types\DefinitelyTyped\node\node.d.ts'/>
/// <reference path='..\types\DefinitelyTyped\express\express.d.ts'/>
/// <reference path='..\types\DefinitelyTyped\mongodb\mongodb.d.ts'/>


import mongodb = require('mongodb');


//ComicItem
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

//EditorTool
    export interface Tool{
        toolName: string;
    }    
    
    export class SpeechBubbleTool implements Tool{
        toolName: string;
        displaySpeechBubbleTool = function(){
            
        };
    }



export class Editor{
  private tools: Tool[];
  private editingComic: Comic;
  private selectedPanel: number;
  
  Constructor(){
      this.tools = null;
      this.editingComic = null;
      this.selectedPanel = null;
      return this;
  }
  
  uploadImage = function(){
      
  } 
  
  saveProject = function(){
      
  }
  
  publishComic =  function(){
      
  }
}

