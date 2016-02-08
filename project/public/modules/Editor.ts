/// <reference path='../../types/DefinitelyTyped/node/node.d.ts'/>
/// <reference path='../../types/DefinitelyTyped/express/express.d.ts'/>
/// <reference path='../../types/DefinitelyTyped/mongodb/mongodb.d.ts'/>
/// <reference path='../../types/DefinitelyTyped/fabricjs/fabricjs.d.ts'/>


// server
//import mongodb = require('mongodb');
// image tools: resize, rotate, etc.
//import editorTool = require('EditorTool');
// for panels
//import comicItem = require('ComicItem');
// speech bubbles
//import speech = require('Speech');


class Editor{
  //private tools: editorTool.Tool[];
  //private editingComic: comicItem.Comic;
  //private selectedPanel: number;
  private panel1: HTMLCanvasElement;
  private imgLoader: HTMLInputElement;

  private canvas1: fabric.ICanvas;

  
  constructor(panel1: HTMLCanvasElement, imgLoader: HTMLInputElement){
      this.panel1 = panel1;
      this.imgLoader = imgLoader;
      this.canvas1 = new fabric.Canvas(this.panel1);
      imgLoader.onchange = (e: Event) => this.showImage(e);
      //this.tools = null;
      //this.editingComic = null;
      //this.selectedPanel = null;
      //return this;

  }
  
  //selectPanel = function(){
      
  //}
  
  showImage(e)   {
    var canvas = this.canvas1;
    console.log("showImage");
    var reader = new FileReader();
    reader.onload = function() { console.log('loadimage');
      var imgObj = new Image();
      imgObj.src = reader.result;
      imgObj.onload = function() {
          var image = new fabric.Image(imgObj, {left: 0, top: 0, angle: 0, padding: 0});
          image.scaleToWidth(400);
          canvas.add(image);

        }
   }
   reader.readAsDataURL(e.target.files[0]);
      
  } 
  
  //saveProject = function(){
      
  //}
  
  //publishComic =  function(){
      
  //}
}

window.onload = function() {
  var panel1 = <HTMLCanvasElement> document.getElementById("panel1");
  var imgLoader = <HTMLInputElement> document.getElementById("imgLoader");
  var editor = new Editor(panel1, imgLoader);
};