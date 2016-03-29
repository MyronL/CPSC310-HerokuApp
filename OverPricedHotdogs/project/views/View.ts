/// <reference path='../../types/DefinitelyTyped/node/node.d.ts'/>
/// <reference path='../../types/DefinitelyTyped/express/express.d.ts'/>
/// <reference path='../../types/DefinitelyTyped/mongodb/mongodb.d.ts'/>
/// <reference path='../../types/DefinitelyTyped/fabricjs/fabricjs.d.ts'/>
/// <reference path='../../types/DefinitelyTyped/jqueryui/jqueryui.d.ts'/>
/// <reference path='../../types/DefinitelyTyped/jquery/jquery.d.ts'/>

class View{

  private saveButton: HTMLButtonElement;
  private saveProjectForm: HTMLFormElement;
  
  constructor(saveProjectForm: HTMLFormElement) {

      this.saveButton = saveButton;
     
      saveButton.onclick = () => this.saveProject();
     
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
 //   console.log(JSON.stringify(this.canvases[0]));
 //   this.saveProjectForm.elements['sPanel2'].value = JSON.stringify(this.canvases[1]);
 //   this.saveProjectForm.elements['sPanel3'].value = JSON.stringify(this.canvases[2]);
 //   this.saveProjectForm.elements['sPanel4'].value = JSON.stringify(this.canvases[3]);
    this.saveProjectForm.submit();
   }
 


window.onload = function() {
  
  var saveButton = <HTMLButtonElement> document.getElementById("saveButton");
 
  var saveProjectForm = <HTMLFormElement> document.getElementById("formSaveProject");

  var view = new View(
    favButton, 
    favForm
  );

  
};

