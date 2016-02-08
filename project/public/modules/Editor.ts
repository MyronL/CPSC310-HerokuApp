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
  private panels: HTMLCanvasElement[];
  private imgLoader: HTMLInputElement;
  private bubbleButton: HTMLButtonElement;
  private squareButton: HTMLButtonElement;
  private thoughtButton: HTMLButtonElement;
  private dialogue: HTMLTextAreaElement;
  private textButton: HTMLButtonElement;
  private colourText: HTMLTextAreaElement;
  private colourButton: HTMLButtonElement;
  private rmTextButton: HTMLButtonElement;

  private canvases: fabric.ICanvas[];

  private bubble = 'http://i.imgur.com/qtDmgzK.png';
  private square = 'http://i.imgur.com/Co7HFts.png';
  private thought = 'http://i.imgur.com/EZruJfs.png';
  private speech: string;

  
  constructor(panels: HTMLCanvasElement[], imgLoader: HTMLInputElement, 
    bubbleButton: HTMLButtonElement, squareButton: HTMLButtonElement, thoughtButton: HTMLButtonElement,
    dialogue: HTMLTextAreaElement, textButton: HTMLButtonElement,
    colourText: HTMLTextAreaElement, colourButton: HTMLButtonElement, rmTextButton: HTMLButtonElement){
      this.panels = panels;
      this.imgLoader = imgLoader;
      this.bubbleButton = bubbleButton;
      this.squareButton = squareButton;
      this.thoughtButton = thoughtButton;
      this.dialogue = dialogue;
      this.textButton = textButton;
      this.colourText = colourText;
      this.colourButton = colourButton;
      this.rmTextButton = rmTextButton;


      this.canvases = [];
      for (var i = 0; i < 4; i++) {
        this.canvases.push(new fabric.Canvas(this.panels[i]));
      }

      imgLoader.onchange = (e: Event) => this.showImage(e);
      bubbleButton.onclick = () => this.clickBubbleButton();
      squareButton.onclick = () => this.clickSquareButton();
      thoughtButton.onclick = () => this.clickThoughtButton();
      textButton.onclick = () => this.addText();
      colourButton.onclick = () => this.setColour();
      rmTextButton.onclick = () => this.removeSelected();
      //this.tools = null;
      //this.editingComic = null;
      //this.selectedPanel = null;
      //return this;

  }
  
  //selectPanel = function(){
      
  //}
  
  showImage(e)   {
    var canvas = this.canvases[0];
    console.log("showImage");
    var reader = new FileReader();
    reader.onload = function() { console.log('loadimage');
      var imgObj = new Image();
      imgObj.src = reader.result;
      imgObj.onload = function() {
          var image = new fabric.Image(imgObj, {left: 0, top: 0, angle: 0, padding: 0});
          image.scaleToWidth(400);
          canvas.add(image);
          canvas.setActiveObject(image);
        }
   }
   reader.readAsDataURL(e.target.files[0]);
      
  } 
  
  helperBubble() {
    console.log("helperBubble " + this.speech);
    var canvas1 = this.canvases[0];
    var canvas2 = this.canvases[1];
    var canvas3 = this.canvases[2];
    var canvas4 = this.canvases[3]; 
    
    fabric.Image.fromURL(this.speech, function(obj) {
        canvas1.on('mouse:down', function(b1){
          canvas1.add(obj);
        });
        canvas1.setActiveObject(obj);
    });
    fabric.Image.fromURL(this.speech, function(obj2) {
        canvas2.on('mouse:down', function(b2){
          canvas2.add(obj2);
        });
        canvas2.setActiveObject(obj2);
    });  
    fabric.Image.fromURL(this.speech, function(obj3) {
        canvas3.on('mouse:down', function(b3){
          canvas3.add(obj3);
        });
        canvas3.setActiveObject(obj3);
    }); 
    fabric.Image.fromURL(this.speech, function(obj4) {
        canvas4.on('mouse:down', function(b4){
          canvas4.add(obj4);
        });
        canvas4.setActiveObject(obj4);
    }); 
  }

  clickBubbleButton() {
    this.speech = this.bubble;
    this.helperBubble();
  }
  clickSquareButton() {
    this.speech = this.square;
    this.helperBubble();
  }
  clickThoughtButton() {
    this.speech = this.thought;
    this.helperBubble();
  }

  addText() {
    var text = this.dialogue.value;
    var textToAdd = new fabric.Text(text, {
        fontFamily: 'Comic Sans'
      });
    this.canvases[0].add(textToAdd);
    this.canvases[0].setActiveObject(textToAdd);

  }

  setColour() {
    console.log("setcolor");
    var colour = this.colourText.value;
    var selected = this.canvases[0].getActiveObject();
    if (selected instanceof fabric.Text) {
      selected.setColor(colour);
      this.canvases[0].renderAll();
    }
  }

  removeSelected() {
    var removeThis = this.canvases[0].getActiveObject();
    if (removeThis instanceof fabric.Text) {
      this.canvases[0].remove(removeThis);
      this.canvases[0].renderAll();  
    }
  }

  //saveProject = function(){
      
  //}
  
  //publishComic =  function(){
      
  //}
}

window.onload = function() {
  var panels: HTMLCanvasElement[] = [];
  panels.push(<HTMLCanvasElement>document.getElementById("panel1"));
  panels.push(<HTMLCanvasElement>document.getElementById("panel2"));
  panels.push(<HTMLCanvasElement>document.getElementById("panel3"));
  panels.push(<HTMLCanvasElement>document.getElementById("panel4"));
  

  var imgLoader = <HTMLInputElement> document.getElementById("imgLoader");
  var bubbleButton = <HTMLButtonElement> document.getElementById("bubbleButton");
  var squareButton = <HTMLButtonElement> document.getElementById("squareButton");
  var thoughtButton = <HTMLButtonElement> document.getElementById("thoughtButton");
  var dialogue = <HTMLTextAreaElement> document.getElementById("dialogue");
  var textButton = <HTMLButtonElement> document.getElementById("textButton");
  var colourText = <HTMLTextAreaElement> document.getElementById("colour");
  var colourButton = <HTMLButtonElement> document.getElementById("colourButton");
  var rmTextButton = <HTMLButtonElement> document.getElementById("rmTextButton");

  var editor = new Editor(panels, imgLoader, 
    bubbleButton, squareButton, thoughtButton, 
    dialogue, textButton,
    colourText, colourButton, rmTextButton);
};