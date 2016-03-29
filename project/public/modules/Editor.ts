/// <reference path='../../types/DefinitelyTyped/node/node.d.ts'/>
/// <reference path='../../types/DefinitelyTyped/express/express.d.ts'/>
/// <reference path='../../types/DefinitelyTyped/mongodb/mongodb.d.ts'/>
/// <reference path='../../types/DefinitelyTyped/fabricjs/fabricjs.d.ts'/>
/// <reference path='../../types/DefinitelyTyped/jqueryui/jqueryui.d.ts'/>
/// <reference path='../../types/DefinitelyTyped/jquery/jquery.d.ts'/>

class Editor{
  //private tools: editorTool.Tool[];
  //private editingComic: comicItem.Comic;
  //private selectedPanel: number;
  private panels: HTMLCanvasElement[];
  private imgLoader: HTMLInputElement;
  private bubbleButton: HTMLElement;
  private squareButton: HTMLButtonElement;
  private thoughtButton: HTMLButtonElement;
  private boxButton: HTMLButtonElement;
  private dialogue: HTMLTextAreaElement;
  private textButton: HTMLButtonElement;
  private styleSelect: HTMLSelectElement;
  private fontSelect: HTMLSelectElement;
  //private colourText: HTMLTextAreaElement;
  private textRed: HTMLInputElement;
  private textGreen: HTMLInputElement;
  private textBlue: HTMLInputElement;
  private textColourCanvas: HTMLCanvasElement;
  private textCanvas: fabric.ICanvas;
  private colourButton: HTMLButtonElement;
  private rmTextButton: HTMLButtonElement;
  private forwardButton: HTMLButtonElement;
  private saveButton: HTMLButtonElement;
  private publishButton: HTMLButtonElement;
//  private deleteButton: HTMLButtonElement;
//  private deleteForm: HTMLFormElement;
  private saveProjectForm: HTMLFormElement;
  private editorID;

  private canvases: fabric.ICanvas[];
  // change panel properties
  private panelSelect: HTMLSelectElement;
  private panelRed: HTMLInputElement;
  private panelGreen: HTMLInputElement;
  private panelBlue: HTMLInputElement;
  private panelColourCanvas: HTMLCanvasElement;
  private panelCanvas: fabric.ICanvas;
  //private panelColour: HTMLTextAreaElement;
  private panelColourButton: HTMLButtonElement;

  //clip art variables
  private hotdog: HTMLInputElement;
  private tree: HTMLInputElement;
  private octopus: HTMLInputElement;
  private duck: HTMLInputElement;
  private seal: HTMLInputElement;
  private bear: HTMLInputElement;
  private penguin: HTMLInputElement;
  private frog: HTMLInputElement;
  private orca: HTMLInputElement;

  // images for speech bubble hosted on imgur
  private bubble = 'http://i.imgur.com/qtDmgzK.png';
  private square = 'http://i.imgur.com/Co7HFts.png';
  private thought = 'http://i.imgur.com/EZruJfs.png';
  private box = 'http://i.imgur.com/sCXVrzn.png';
  private speech: string;

  // fonts for text in editor
  private font = 'ComicSans';
  private style = 'normal';
  private weight = 'normal';

  // panel variables
  // rectangles are set to lines on the canvas
  // you need to adjust them first to actual comic panels
  private panelLine1 = new fabric.Rect({
          left: 400,
          top: -1,
          width: 3,
          height: 401,
          fill: "black",
          selectable: false
  });
  private panelLine2 = new fabric.Rect({
          left: 800, // was 810
          top: -1,
          width: 3,
          height: 401,
          fill: "black",
          selectable: false
  });
  private panelLine3 = new fabric.Rect({
          left: 1200, // 1220
          top: -1,
          width: 3,
          height: 401,
          fill: "black",
          selectable: false
  });
  // actual panels
  private panelRect1 = new fabric.Rect({
          left: -1,
          top: -1,
          width: 402,
          height: 401,
          fill: "rgb(255,255,255)",
          //fill: "red",
          selectable: false
  });

  private panelRect2 = new fabric.Rect({
          left: 400,
          top: -1,
          width: 402,
          height: 401,
          fill: "rgb(255,255,255)",
          selectable: false
  });
  
  private panelRect3 = new fabric.Rect({
          left: 800,
          top: -1,
          width: 402,
          height: 401,
          fill: "rgb(255,255,255)",
          selectable: false
  });
  
  private panelRect4 = new fabric.Rect({
          left: 1200,
          top: -1,
          width: 402,
          height: 401,
          fill: "rgb(255,255,255)",
          selectable: false 
  });

  private selectedPanel = this.panelRect1;
  
  constructor(
    panels: HTMLCanvasElement[], 
    imgLoader: HTMLInputElement, 
    bubbleButton: HTMLElement, 
    squareButton: HTMLButtonElement, 
    thoughtButton: HTMLButtonElement,
    boxButton: HTMLButtonElement,
    dialogue: HTMLTextAreaElement, 
    textButton: HTMLButtonElement,
    styleSelect: HTMLSelectElement,
    fontSelect: HTMLSelectElement,
    //colourText: HTMLTextAreaElement,
    textRed: HTMLInputElement,
    textGreen: HTMLInputElement,
    textBlue: HTMLInputElement,
    textColourCanvas: HTMLCanvasElement, 
    colourButton: HTMLButtonElement, 
    rmTextButton: HTMLButtonElement, 
    forwardButton: HTMLButtonElement,
    saveButton: HTMLButtonElement, 
    saveProjectForm: HTMLFormElement, 
    publishButton: HTMLButtonElement,
    panelSelect: HTMLSelectElement,
    panelRed: HTMLInputElement,
    panelGreen: HTMLInputElement,
    panelBlue: HTMLInputElement,
    panelColourCanvas: HTMLCanvasElement,
    //panelColour: HTMLTextAreaElement,
    panelColourButton: HTMLButtonElement,
    hotdog: HTMLInputElement,
    tree: HTMLInputElement,
    octopus: HTMLInputElement,
    duck: HTMLInputElement,
    seal: HTMLInputElement,
    bear: HTMLInputElement,
    penguin: HTMLInputElement,
    frog: HTMLInputElement,
    orca: HTMLInputElement
    ) {

      this.panels = panels;
      this.imgLoader = imgLoader;
      this.bubbleButton = bubbleButton;
      this.squareButton = squareButton;
      this.thoughtButton = thoughtButton;
      this.boxButton = boxButton;
      this.dialogue = dialogue;
      this.textButton = textButton;
      this.styleSelect = styleSelect;
      this.fontSelect = fontSelect;
      //this.colourText = colourText;
      this.textRed = textRed;
      this.textGreen = textGreen;
      this.textBlue = textBlue;
      this.textColourCanvas = textColourCanvas;
      this.textCanvas = new fabric.Canvas(this.textColourCanvas);
      this.textCanvas.setBackgroundColor("rgb(0,0,0)", this.textCanvas.renderAll.bind(this.textCanvas));
      this.colourButton = colourButton;
      this.rmTextButton = rmTextButton;
      this.saveButton = saveButton;
      this.publishButton = publishButton;
   //   this.deleteButton = deleteButton;
  //    this.deleteForm = deleteForm;
      this.saveProjectForm = saveProjectForm;
      this.forwardButton = forwardButton;
      this.editorID = "0";

      this.canvases = [];
      this.canvases.push(new fabric.Canvas(this.panels[0]));
      this.canvases[0].setBackgroundColor("white", function(b){
        console.log("Canvas background set to white")
      });
      // for (var i = 0; i < 4; i++) {
      //   this.canvases.push(new fabric.Canvas(this.panels[i]));
      // }
      this.panelSelect = panelSelect;
      this.panelRed = panelRed;
      this.panelGreen = panelGreen;
      this.panelBlue = panelBlue;
      this.panelColourCanvas = panelColourCanvas;
      this.panelCanvas = new fabric.Canvas(this.panelColourCanvas);
      this.panelCanvas.setBackgroundColor("rgb(255,255,255)", this.panelCanvas.renderAll.bind(this.panelCanvas));
      //this.panelColour = panelColour;
      this.panelColourButton = panelColourButton;
      // clip art variables
      this.hotdog = hotdog;
      this.tree = tree;
      this.octopus = octopus;
      this.duck = duck;
      this.seal = seal;
      this.bear = bear;
      this.penguin = penguin;
      this.frog = frog;
      this.orca = orca;

      imgLoader.onchange = (e: Event) => this.showImage(e);
      bubbleButton.onclick = () => this.clickBubbleButton();
      squareButton.onclick = () => this.clickSquareButton();
      thoughtButton.onclick = () => this.clickThoughtButton();
      boxButton.onclick = () => this.clickBoxButton();
      textButton.onclick = () => this.addText();
      styleSelect.onchange = () => this.selectStyle();
      fontSelect.onchange = () => this.selectFont();
      textRed.oninput = () => this.updateTextPreview();
      textGreen.oninput = () => this.updateTextPreview();
      textBlue.oninput = () => this.updateTextPreview();
      colourButton.onclick = () => this.setColour();
      rmTextButton.onclick = () => this.removeSelected();
      forwardButton.onclick = () => this.forwards();
      saveButton.onclick = () => this.saveProject();
      publishButton.onclick = () => this.publishProject();
      panelSelect.onchange = () => this.selectPanel();
      panelRed.oninput = () => this.updatePanelPreview();
      panelGreen.oninput = () => this.updatePanelPreview();
      panelBlue.oninput = () => this.updatePanelPreview();
      panelColourButton.onclick = () => this.setPanelColor();
      hotdog.onclick = () => this.addhotdog();
      tree.onclick = () => this.addTree();
      octopus.onclick = () => this.addOctopus();
      duck.onclick = () => this.addDuck();
      seal.onclick = () => this.addSeal();
      bear.onclick = () => this.addBear();
      penguin.onclick = () => this.addPenguin();
      frog.onclick = () => this.addFrog();
      orca.onclick = () => this.addOrca();
   //   deleteButton.onclick = () => this.confirmDelete();
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
      var options = { left: 0, top: 0, angle: 0, padding: 0 };
      imgObj.setAttribute('crossOrigin', 'anonymous');
      imgObj.src = reader.result;
      imgObj.onload = function() {
          var image = new fabric.Image(imgObj, options);
          image.scaleToHeight(canvas.getHeight());
          canvas.add(image);
          canvas.setActiveObject(image);
          canvas.renderAll();
          imgObj = null; // dereference

          var originalPhotoObject = canvas.getActiveObject();
          var newImg = new Image();
          newImg.onload = function(){
            var imgInstance = new fabric.Image(newImg, options);
            canvas.remove(originalPhotoObject);
            canvas.add(imgInstance);
            canvas.renderAll();
            newImg = null;
          }
        }
   }
   reader.readAsDataURL(e.target.files[0]);
   // consider resetting selected image in loader after it's been successfully loaded
  } 
  
  helperBubble() {
    console.log("helperBubble " + this.speech);
    var canvas1 = this.canvases[0];
   
    
    fabric.Image.fromURL(this.speech, function(obj) {
        canvas1.add(obj);
        canvas1.setActiveObject(obj);
        this.canvases[0].renderAll();
    }, { crossOrigin: 'anonymous' });

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
  clickBoxButton() {
    this.speech = this.box;
    this.helperBubble();
  }

  addText() {
    var text = this.dialogue.value;
    var textToAdd = new fabric.IText(text, {
        fontFamily: this.font,
        fontWeight: this.weight, 
        fontStyle: this.style 
      });
    this.canvases[0].add(textToAdd);
    this.canvases[0].renderAll();
    this.canvases[0].setActiveObject(textToAdd);
  }

  selectStyle() { // errors are false positives
    var active = this.canvases[0].getActiveObject();
    var textStyle = (<HTMLInputElement>document.getElementById("styleSelect")).value;
    if (textStyle === "Normal") {
      this.style = "normal";
      this.weight = "normal";
    } else if (textStyle === "Bold") {
      this.style = "normal";
      this.weight = 800;
    } else if (textStyle === "Italic") {
      this.style = "italic";
      this.weight = "normal";
    } else if (textStyle === "BoldItalic") {
      this.style = "italic";
      this.weight = 800;
    }
    active.setFontStyle(this.style);
    active.setFontWeight(this.weight);
    this.canvases[0].renderAll();
  }

  selectFont() {
    this.font = (<HTMLInputElement>document.getElementById("fontSelect")).value;
    // this throws a false error: typescript doesn't know about the class relationships
    this.canvases[0].getActiveObject().setFontFamily(this.font);
    this.canvases[0].renderAll();
  }

  // for text
  setColour() {
    console.log("setcolor");
    //var colour = this.colourText.value;
    var selected = this.canvases[0].getActiveObject();
    var r = (<HTMLInputElement>document.getElementById("textRed")).value;
    var g = (<HTMLInputElement>document.getElementById("textGreen")).value;
    var b = (<HTMLInputElement>document.getElementById("textBlue")).value;
    var colourString = "rgb(" + r + "," + g + "," + b + ")";
    if (selected instanceof fabric.Text) {
    selected.setColor(colourString);
      this.canvases[0].renderAll();
    }
  }

  updateTextPreview() {
    var r = (<HTMLInputElement>document.getElementById("textRed")).value;
    var g = (<HTMLInputElement>document.getElementById("textGreen")).value;
    var b = (<HTMLInputElement>document.getElementById("textBlue")).value;
    var colourString = "rgb(" + r + "," + g + "," + b + ")";
    this.textCanvas.setBackgroundColor(colourString, this.textCanvas.renderAll.bind(this.textCanvas));
  }

  removeSelected() {
    var removeThis = this.canvases[0].getActiveObject();
      this.canvases[0].remove(removeThis);
      this.canvases[0].renderAll();  
   }

  forwards() {
     var forward = this.canvases[0].getActiveObject();
     this.canvases [0].bringForward(forward);
     this.canvases[0].bringForward(forward);
     this.canvases[0].renderAll(); 
  } 

  backwards() {
    // TODO?: may need to factor in a backwards button
  }
  publishProject(){
    this.canvases[0].deactivateAll();
    this.saveProjectForm.elements['published'].value = true;
    this.canvases[0].includeDefaultValues = false;
    this.saveProjectForm.elements['sPanel1'].value = JSON.stringify(this.canvases[0].toJSON(['selectable']));
    this.saveProjectForm.elements['thumbnail'].value = this.canvases[0].toDataURL();
    this.saveProjectForm.elements['editorID'].value = this.editorID;
    
    var seriesSelect = <HTMLSelectElement>document.getElementById("seriesSelect");
    var newSeries = <HTMLTextAreaElement> document.getElementById("newSeries");
    
    this.saveProjectForm.elements['seriesSelect'].value=seriesSelect.value;
    this.saveProjectForm.elements['newSeries'].value = newSeries.value;
 //   console.log(JSON.stringify(this.canvases[0]));
 //   this.saveProjectForm.elements['sPanel2'].value = JSON.stringify(this.canvases[1]);
 //   this.saveProjectForm.elements['sPanel3'].value = JSON.stringify(this.canvases[2]);
 //   this.saveProjectForm.elements['sPanel4'].value = JSON.stringify(this.canvases[3]);
    this.saveProjectForm.submit(); 
  }
  saveProject(){
    this.canvases[0].deactivateAll();
    this.saveProjectForm.elements['published'].value = false;
    this.canvases[0].includeDefaultValues = false;
    this.saveProjectForm.elements['sPanel1'].value = JSON.stringify(this.canvases[0].toJSON(['selectable']));
    this.saveProjectForm.elements['thumbnail'].value = null;
    this.saveProjectForm.elements['editorID'].value = this.editorID;
    console.log(this.editorID);
    var seriesSelect = <HTMLSelectElement>document.getElementById("seriesSelect2");
    var newSeries = <HTMLTextAreaElement> document.getElementById("newSeries2");
    
    this.saveProjectForm.elements['seriesSelect'].value=seriesSelect.value;
    this.saveProjectForm.elements['newSeries'].value = newSeries.value;
 //   console.log(JSON.stringify(this.canvases[0]));
 //   this.saveProjectForm.elements['sPanel2'].value = JSON.stringify(this.canvases[1]);
 //   this.saveProjectForm.elements['sPanel3'].value = JSON.stringify(this.canvases[2]);
 //   this.saveProjectForm.elements['sPanel4'].value = JSON.stringify(this.canvases[3]);
    this.saveProjectForm.submit();
   }
 /*  
   confirmDelete(){
      var r = confirm("Do you really want to delete the project? Deletion cannot be recovered")
     if (r == true){
        console.log("Deleting");
        this.deleteProject();
     } else {
         console.log("Do Nothing");
     }
      
   }
   
   // I don't know what I'm doing
   deleteProject(){
     //stub
        this.deleteForm.submit();
   }
*/
   loadProject(loadProject) {
      var title = loadProject[0].title;
      var description = loadProject[0].description;
      var tags = loadProject[0].tags;
      var author = loadProject[0].author;
      var JsonPanel1 = loadProject[0].panel1;
      var series = loadProject[0].series;
 //     var JsonPanel2 = loadProject[0].panel2;
 //     var JsonPanel3 = loadProject[0].panel3;
 //     var JsonPanel4 = loadProject[0].panel4;
      console.log(title);
      $('#comicTitle').val(title);
      $('#comicDescription').val(description);
      $('#comicTags').val(tags);
      $('#series').val("Series: "+series);
      //console.log(loadProject[0])
      this.canvases[0].loadFromJSON(JsonPanel1, this.canvases[0].renderAll.bind(this.canvases[0]));

   }
   

   
   //move border to front -> working but not in use
   putBordertoFront(){
       this.canvases[0].bringToFront(this.panelLine1);
       this.canvases[0].bringToFront(this.panelLine2);
       this.canvases[0].bringToFront(this.panelLine3);
   }
   
   // TODO: add rectangles to this if you want to load your panels
   loadEmptyPanels(){
      var canvas = this.canvases[0];
      canvas.add(this.panelLine1);
      canvas.add(this.panelLine2); 
      canvas.add(this.panelLine3);
      canvas.add(this.panelRect1);
      canvas.add(this.panelRect2);
      canvas.add(this.panelRect3);
      canvas.add(this.panelRect4);
      this.putBordertoFront();
   }
   setEditorID(ID){
       this.editorID = ID;
       //console.log("set"+this.editorID);
   }

   selectPanel() {
     var selected = (<HTMLInputElement>document.getElementById("panelSelect")).value;
     if (selected === "Panel1") {
       this.selectedPanel = this.panelRect1;
     } else if (selected === "Panel2") {
       this.selectedPanel = this.panelRect2;
     } else if (selected === "Panel3") {
       this.selectedPanel = this.panelRect3;
     } else if (selected === "Panel4") {
       this.selectedPanel = this.panelRect4;
     }
   }

   setPanelColor() {
    this.canvases[0].remove(this.selectedPanel);
    var r = (<HTMLInputElement>document.getElementById("panelRed")).value;
    var g = (<HTMLInputElement>document.getElementById("panelGreen")).value;
    var b = (<HTMLInputElement>document.getElementById("panelBlue")).value;
    var colourString = "rgb(" + r + "," + g + "," + b + ")";
    this.selectedPanel.setColor(colourString);
    this.canvases[0].add(this.selectedPanel);
    this.canvases[0].sendToBack(this.selectedPanel);
    //this.putBordertoFront();

   }

   updatePanelPreview() {
    var r = (<HTMLInputElement>document.getElementById("panelRed")).value;
    var g = (<HTMLInputElement>document.getElementById("panelGreen")).value;
    var b = (<HTMLInputElement>document.getElementById("panelBlue")).value;
    var colourString = "rgb(" + r + "," + g + "," + b + ")";
    this.panelCanvas.setBackgroundColor(colourString, this.panelCanvas.renderAll.bind(this.panelCanvas));
   }

   addClipArt(url){
     var canvas1 = this.canvases[0];
     fabric.Image.fromURL(url, function(obj) {
       obj.scaleToHeight(canvas1.getHeight());
       canvas1.add(obj);
       canvas1 .setActiveObject(obj);
       canvas1.renderAll();
     }, { crossOrigin: 'anonymous' });
   }

   addhotdog(){
     var url = (<HTMLInputElement>document.getElementById("hotdog")).src;
     this.addClipArt(url);
   }
   addTree(){
var url = (<HTMLInputElement>document.getElementById("tree")).src;
this.addClipArt(url);
   }
   addOctopus() {
var url = (<HTMLInputElement>document.getElementById("octopus")).src;
this.addClipArt(url);
   }
   addDuck() {
var url = (<HTMLInputElement>document.getElementById("duck")).src;
this.addClipArt(url);
   }
   addSeal() {
var url = (<HTMLInputElement>document.getElementById("seal")).src;
this.addClipArt(url);
   }
   addBear() {
var url = (<HTMLInputElement>document.getElementById("bear")).src;
this.addClipArt(url);
   }
   addPenguin() {
var url = (<HTMLInputElement>document.getElementById("penguin")).src;
this.addClipArt(url);
   }
   addFrog() {
var url = (<HTMLInputElement>document.getElementById("frog")).src;
this.addClipArt(url);
   }
   addOrca() {
var url = (<HTMLInputElement>document.getElementById("orca")).src;
this.addClipArt(url);
   }
}



window.onload = function() {
  var panels: HTMLCanvasElement[] = [];
  panels.push(<HTMLCanvasElement>document.getElementById("panel1"));
//  panels.push(<HTMLCanvasElement>document.getElementById("panel2"));
//  panels.push(<HTMLCanvasElement>document.getElementById("panel3"));
//  panels.push(<HTMLCanvasElement>document.getElementById("panel4"));
  

  var imgLoader = <HTMLInputElement> document.getElementById("imgLoader");
  var bubbleButton = <HTMLElement> document.getElementById("bubbleButton");
  var squareButton = <HTMLButtonElement> document.getElementById("squareButton");
  var thoughtButton = <HTMLButtonElement> document.getElementById("thoughtButton");
  var boxButton = <HTMLButtonElement>document.getElementById("boxButton");
  var dialogue = <HTMLTextAreaElement> document.getElementById("dialogue");
  var textButton = <HTMLButtonElement> document.getElementById("textButton");
  var styleSelect = <HTMLSelectElement>document.getElementById("styleSelect");
  var fontSelect = <HTMLSelectElement> document.getElementById("fontSelect");
  //var colourText = <HTMLTextAreaElement> document.getElementById("colour");
  var textRed = <HTMLInputElement>document.getElementById("textRed");
  var textGreen = <HTMLInputElement>document.getElementById("textGreen");
  var textBlue = <HTMLInputElement>document.getElementById("textBlue");
  var textColourCanvas = <HTMLCanvasElement>document.getElementById("textColourCanvas");
  var colourButton = <HTMLButtonElement>document.getElementById("colourButton");
  var rmTextButton = <HTMLButtonElement> document.getElementById("rmTextButton");
  var forwardButton = <HTMLButtonElement>document.getElementById("forwardButton");
  var saveButton = <HTMLButtonElement> document.getElementById("saveButton");
  var publishButton = <HTMLButtonElement> document.getElementById("publishButton");
//  var deleteButton = <HTMLButtonElement> document.getElementById("deleteButton");
//  var deleteForm = <HTMLFormElement>document.getElementById("deleteForm");
  var saveProjectForm = <HTMLFormElement> document.getElementById("formSaveProject");
  var panelSelect = <HTMLSelectElement> document.getElementById("panelSelect");
  var panelRed = <HTMLInputElement>document.getElementById("panelRed");
  var panelGreen = <HTMLInputElement>document.getElementById("panelGreen");
  var panelBlue = <HTMLInputElement>document.getElementById("panelBlue");
  var panelColourCanvas = <HTMLCanvasElement>document.getElementById("panelColourCanvas");
  //var panelColour = <HTMLTextAreaElement> document.getElementById("panelColour");
  var panelColourButton = <HTMLButtonElement>document.getElementById("panelColourButton");
  // clip art variables
  var hotdog = <HTMLInputElement>document.getElementById("hotdog");
  var tree = <HTMLInputElement>document.getElementById("tree");
  var octopus = <HTMLInputElement>document.getElementById("octopus");
  var duck = <HTMLInputElement>document.getElementById("duck");
  var seal = <HTMLInputElement>document.getElementById("seal");
  var bear = <HTMLInputElement>document.getElementById("bear");
  var penguin = <HTMLInputElement>document.getElementById("penguin");
  var frog = <HTMLInputElement>document.getElementById("frog");
  var orca = <HTMLInputElement>document.getElementById("orca");

  var editor = new Editor(
    panels, 
    imgLoader, 
    bubbleButton, 
    squareButton, 
    thoughtButton,
    boxButton, 
    dialogue, 
    textButton,
    styleSelect,
    fontSelect,
    //colourText,
    textRed,
    textGreen,
    textBlue,
    textColourCanvas, 
    colourButton, 
    rmTextButton, 
    forwardButton, 
    saveButton, 
    saveProjectForm, 
    publishButton,
    panelSelect,
    //panelColour,
    panelRed,
    panelGreen,
    panelBlue,
    panelColourCanvas,
    panelColourButton,
    hotdog,
    tree,
    octopus,
    duck,
    seal,
    bear,
    penguin,
    frog,
    orca
    );

  // load project is not defined
  /*
  if(userSeries == null){
      userSeries = ["None"];
      console.log(userSeries);
  } else {
      userSeries = userSeries[0].series;
      //console.log(userSeries);
  }
  */
  
  if (loadProject == null){
      editor.loadEmptyPanels();
      console.log("nothing");
  } else {
      editor.loadProject(loadProject);
      editor.setEditorID(loadProject[0]._id);
  }
  
};

