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
  private colourText: HTMLTextAreaElement;
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

  private panelLine1 = new fabric.Rect({
          left: 400,
          top: -1,
          width: 3,
          height: 401,
          fill: "black",
          selectable: false
  });
  private panelLine2 = new fabric.Rect({
          left: 810,
          top: -1,
          width: 3,
          height: 401,
          fill: "black",
          selectable: false
  });
  private panelLine3 = new fabric.Rect({
          left: 1220,
          top: -1,
          width: 3,
          height: 401,
          fill: "black",
          selectable: false
  });
  
  constructor(panels: HTMLCanvasElement[], 
    imgLoader: HTMLInputElement, 
    bubbleButton: HTMLElement, 
    squareButton: HTMLButtonElement, 
    thoughtButton: HTMLButtonElement,
    boxButton: HTMLButtonElement,
    dialogue: HTMLTextAreaElement, 
    textButton: HTMLButtonElement,
    styleSelect: HTMLSelectElement,
    fontSelect: HTMLSelectElement,
    colourText: HTMLTextAreaElement, 
    colourButton: HTMLButtonElement, 
    rmTextButton: HTMLButtonElement, 
    forwardButton: HTMLButtonElement,
    saveButton: HTMLButtonElement, 
    saveProjectForm: HTMLFormElement, 
    publishButton: HTMLButtonElement
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
      this.colourText = colourText;
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

      imgLoader.onchange = (e: Event) => this.showImage(e);
      bubbleButton.onclick = () => this.clickBubbleButton();
      squareButton.onclick = () => this.clickSquareButton();
      thoughtButton.onclick = () => this.clickThoughtButton();
      boxButton.onclick = () => this.clickBoxButton();
      textButton.onclick = () => this.addText();
      styleSelect.onchange = () => this.selectStyle();
      fontSelect.onchange = () => this.selectFont();
      colourButton.onclick = () => this.setColour();
      rmTextButton.onclick = () => this.removeSelected();
      forwardButton.onclick = () => this.forwards();
      saveButton.onclick = () => this.saveProject();
      publishButton.onclick = () => this.publishProject();
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
      imgObj.setAttribute('crossOrigin', 'anonymous');
      imgObj.src = reader.result;
      imgObj.onload = function() {
          var image = new fabric.Image(imgObj, {left: 0, top: 0, angle: 0, padding: 0});
          image.scaleToWidth(300);
          canvas.add(image);
          canvas.setActiveObject(image);
        }
   }
   reader.readAsDataURL(e.target.files[0]);
      
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
      this.canvases[0].remove(removeThis);
      this.canvases[0].renderAll();  
   }

  forwards() {
     var forward = this.canvases[0].getActiveObject();
     this.canvases [0].bringForward(forward);
     this.canvases[0].bringForward(forward);
     this.canvases[0].renderAll(); 
  } 

  publishProject(){
    this.canvases[0].deactivateAll();
    this.saveProjectForm.elements['published'].value = true;
    this.saveProjectForm.elements['sPanel1'].value = JSON.stringify(this.canvases[0]);
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
/*    this.canvases[0].forEachObject(function(obj){
        obj.sourcePath = '/uploadIMG/FILE.svg';
        console.log(obj.sourcePath);
    });
    */
    this.canvases[0].deactivateAll();
    this.saveProjectForm.elements['published'].value = false;
    this.saveProjectForm.elements['sPanel1'].value = JSON.stringify(this.canvases[0]);
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
   
   // TODO: I don't know what I'm doing
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
 //     var JsonPanel2 = loadProject[0].panel2;
 //     var JsonPanel3 = loadProject[0].panel3;
 //     var JsonPanel4 = loadProject[0].panel4;
      console.log(title);
      $('#comicTitle').val(title);
      $('#comicDescription').val(description);
      $('#comicTags').val(tags);      
      console.log(loadProject[0])
      this.canvases[0].loadFromJSON(JsonPanel1, this.canvases[0].renderAll.bind(this.canvases[0]));

   }
   
   //move border to front -> working but not in use
   putBordertoFront(){
       this.canvases[0].bringToFront(this.panelLine1);
       this.canvases[0].bringToFront(this.panelLine2);
       this.canvases[0].bringToFront(this.panelLine3);
   }
   
   
   loadEmptyPanels(){
      var canvas = this.canvases[0];
      canvas.add(this.panelLine1);
      canvas.add(this.panelLine2); 
      canvas.add(this.panelLine3);  
   }
   setEditorID(ID){
       this.editorID = ID;
       console.log("set"+this.editorID);
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
  var colourText = <HTMLTextAreaElement> document.getElementById("colour");
  var colourButton = <HTMLButtonElement> document.getElementById("colourButton");
  var rmTextButton = <HTMLButtonElement> document.getElementById("rmTextButton");
  var forwardButton = <HTMLButtonElement>document.getElementById("forwardButton");
  var saveButton = <HTMLButtonElement> document.getElementById("saveButton");
  var publishButton = <HTMLButtonElement> document.getElementById("publishButton");
//  var deleteButton = <HTMLButtonElement> document.getElementById("deleteButton");
//  var deleteForm = <HTMLFormElement>document.getElementById("deleteForm");
  var saveProjectForm = <HTMLFormElement> document.getElementById("formSaveProject");


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
    colourText, 
    colourButton, 
    rmTextButton, 
    forwardButton, 
    saveButton, 
    saveProjectForm, 
    publishButton
    );

  // load project is not defined
  if (loadProject == null){
      editor.loadEmptyPanels();
      console.log("nothing");
  } else {
      editor.loadProject(loadProject);
      editor.setEditorID(loadProject[0]._id);
  }
  
};

