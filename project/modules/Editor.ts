/// <reference path='..\types\DefinitelyTyped\node\node.d.ts'/>
/// <reference path='..\types\DefinitelyTyped\express\express.d.ts'/>
/// <reference path='..\types\DefinitelyTyped\mongodb\mongodb.d.ts'/>


import mongodb = require('mongodb');
import editorTool = require('EditorTool');
import comicItem = require('ComicItem');

export class Editor{
  private tools: editorTool.Tool[];
  private editingComic: comicItem.Comic;
  private selectedPanel: number;
  
  Constructor(){
      this.tools = null;
      this.editingComic = null;
      this.selectedPanel = null;
      return this;
  }
  
  selectPanel = function(){
      
  }
  
  uploadImage = function(){
      
  } 
  
  saveProject = function(){
      
  }
  
  publishComic =  function(){
      
  }
}

