/// <reference path='../../types/DefinitelyTyped/node/node.d.ts'/>
/// <reference path='../../types/DefinitelyTyped/express/express.d.ts'/>
/// <reference path='../../types/DefinitelyTyped/mongodb/mongodb.d.ts'/>
/// <reference path='../../types/DefinitelyTyped/fabricjs/fabricjs.d.ts'/>
/// <reference path='../../types/DefinitelyTyped/jqueryui/jqueryui.d.ts'/>
/// <reference path='../../types/DefinitelyTyped/jquery/jquery.d.ts'/>
var Editor = (function () {
    function Editor(panels, imgLoader, bubbleButton, squareButton, thoughtButton, boxButton, dialogue, textButton, styleSelect, fontSelect, colourText, colourButton, rmTextButton, forwardButton, saveButton, saveProjectForm, publishButton) {
        var _this = this;
        // images for speech bubble hosted on imgur
        this.bubble = 'http://i.imgur.com/qtDmgzK.png';
        this.square = 'http://i.imgur.com/Co7HFts.png';
        this.thought = 'http://i.imgur.com/EZruJfs.png';
        this.box = 'http://i.imgur.com/sCXVrzn.png';
        // fonts for text in editor
        this.font = 'ComicSans';
        this.style = 'normal';
        this.weight = 'normal';
        this.panelLine1 = new fabric.Rect({
            left: 400,
            top: -1,
            width: 3,
            height: 401,
            fill: "black",
            selectable: false
        });
        this.panelLine2 = new fabric.Rect({
            left: 810,
            top: -1,
            width: 3,
            height: 401,
            fill: "black",
            selectable: false
        });
        this.panelLine3 = new fabric.Rect({
            left: 1220,
            top: -1,
            width: 3,
            height: 401,
            fill: "black",
            selectable: false
        });
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
        this.canvases[0].setBackgroundColor("white", function (b) {
            console.log("Canvas background set to white");
        });
        // for (var i = 0; i < 4; i++) {
        //   this.canvases.push(new fabric.Canvas(this.panels[i]));
        // }
        imgLoader.onchange = function (e) { return _this.showImage(e); };
        bubbleButton.onclick = function () { return _this.clickBubbleButton(); };
        squareButton.onclick = function () { return _this.clickSquareButton(); };
        thoughtButton.onclick = function () { return _this.clickThoughtButton(); };
        boxButton.onclick = function () { return _this.clickBoxButton(); };
        textButton.onclick = function () { return _this.addText(); };
        styleSelect.onchange = function () { return _this.selectStyle(); };
        fontSelect.onchange = function () { return _this.selectFont(); };
        colourButton.onclick = function () { return _this.setColour(); };
        rmTextButton.onclick = function () { return _this.removeSelected(); };
        forwardButton.onclick = function () { return _this.forwards(); };
        saveButton.onclick = function () { return _this.saveProject(); };
        publishButton.onclick = function () { return _this.publishProject(); };
        //   deleteButton.onclick = () => this.confirmDelete();
        //this.tools = null;
        //this.editingComic = null;
        //this.selectedPanel = null;
        //return this;
    }
    //selectPanel = function(){
    //}
    Editor.prototype.showImage = function (e) {
        var canvas = this.canvases[0];
        console.log("showImage");
        var reader = new FileReader();
        reader.onload = function () {
            console.log('loadimage');
            var imgObj = new Image();
            imgObj.setAttribute('crossOrigin', 'anonymous');
            imgObj.src = reader.result;
            imgObj.onload = function () {
                var image = new fabric.Image(imgObj, { left: 0, top: 0, angle: 0, padding: 0 });
                image.scaleToWidth(300);
                canvas.add(image);
                canvas.setActiveObject(image);
            };
        };
        reader.readAsDataURL(e.target.files[0]);
    };
    Editor.prototype.helperBubble = function () {
        console.log("helperBubble " + this.speech);
        var canvas1 = this.canvases[0];
        fabric.Image.fromURL(this.speech, function (obj) {
            canvas1.add(obj);
            canvas1.setActiveObject(obj);
            this.canvases[0].renderAll();
        }, { crossOrigin: 'anonymous' });
    };
    Editor.prototype.clickBubbleButton = function () {
        this.speech = this.bubble;
        this.helperBubble();
    };
    Editor.prototype.clickSquareButton = function () {
        this.speech = this.square;
        this.helperBubble();
    };
    Editor.prototype.clickThoughtButton = function () {
        this.speech = this.thought;
        this.helperBubble();
    };
    Editor.prototype.clickBoxButton = function () {
        this.speech = this.box;
        this.helperBubble();
    };
    Editor.prototype.addText = function () {
        var text = this.dialogue.value;
        var textToAdd = new fabric.IText(text, {
            fontFamily: this.font,
            fontWeight: this.weight,
            fontStyle: this.style
        });
        this.canvases[0].add(textToAdd);
        this.canvases[0].renderAll();
        this.canvases[0].setActiveObject(textToAdd);
    };
    Editor.prototype.selectStyle = function () {
        var active = this.canvases[0].getActiveObject();
        var textStyle = document.getElementById("styleSelect").value;
        if (textStyle === "Normal") {
            this.style = "normal";
            this.weight = "normal";
        }
        else if (textStyle === "Bold") {
            this.style = "normal";
            this.weight = 800;
        }
        else if (textStyle === "Italic") {
            this.style = "italic";
            this.weight = "normal";
        }
        else if (textStyle === "BoldItalic") {
            this.style = "italic";
            this.weight = 800;
        }
        active.setFontStyle(this.style);
        active.setFontWeight(this.weight);
        this.canvases[0].renderAll();
    };
    Editor.prototype.selectFont = function () {
        this.font = document.getElementById("fontSelect").value;
        // this throws a false error: typescript doesn't know about the class relationships
        this.canvases[0].getActiveObject().setFontFamily(this.font);
        this.canvases[0].renderAll();
    };
    Editor.prototype.setColour = function () {
        console.log("setcolor");
        var colour = this.colourText.value;
        var selected = this.canvases[0].getActiveObject();
        if (selected instanceof fabric.Text) {
            selected.setColor(colour);
            this.canvases[0].renderAll();
        }
    };
    Editor.prototype.removeSelected = function () {
        var removeThis = this.canvases[0].getActiveObject();
        this.canvases[0].remove(removeThis);
        this.canvases[0].renderAll();
    };
    Editor.prototype.forwards = function () {
        var forward = this.canvases[0].getActiveObject();
        this.canvases[0].bringForward(forward);
        this.canvases[0].bringForward(forward);
        this.canvases[0].renderAll();
    };
    Editor.prototype.publishProject = function () {
        this.canvases[0].deactivateAll();
        this.saveProjectForm.elements['published'].value = true;
        this.saveProjectForm.elements['sPanel1'].value = JSON.stringify(this.canvases[0]);
        this.saveProjectForm.elements['thumbnail'].value = this.canvases[0].toDataURL();
        this.saveProjectForm.elements['editorID'].value = this.editorID;
        //   console.log(JSON.stringify(this.canvases[0]));
        //   this.saveProjectForm.elements['sPanel2'].value = JSON.stringify(this.canvases[1]);
        //   this.saveProjectForm.elements['sPanel3'].value = JSON.stringify(this.canvases[2]);
        //   this.saveProjectForm.elements['sPanel4'].value = JSON.stringify(this.canvases[3]);
        this.saveProjectForm.submit();
    };
    Editor.prototype.saveProject = function () {
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
    };
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
    Editor.prototype.loadProject = function (loadProject) {
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
        console.log(loadProject[0]);
        this.canvases[0].loadFromJSON(JsonPanel1, this.canvases[0].renderAll.bind(this.canvases[0]));
    };
    //move border to front -> working but not in use
    Editor.prototype.putBordertoFront = function () {
        this.canvases[0].bringToFront(this.panelLine1);
        this.canvases[0].bringToFront(this.panelLine2);
        this.canvases[0].bringToFront(this.panelLine3);
    };
    Editor.prototype.loadEmptyPanels = function () {
        var canvas = this.canvases[0];
        canvas.add(this.panelLine1);
        canvas.add(this.panelLine2);
        canvas.add(this.panelLine3);
    };
    Editor.prototype.setEditorID = function (ID) {
        this.editorID = ID;
        console.log("set" + this.editorID);
    };
    return Editor;
})();
window.onload = function () {
    var panels = [];
    panels.push(document.getElementById("panel1"));
    //  panels.push(<HTMLCanvasElement>document.getElementById("panel2"));
    //  panels.push(<HTMLCanvasElement>document.getElementById("panel3"));
    //  panels.push(<HTMLCanvasElement>document.getElementById("panel4"));
    var imgLoader = document.getElementById("imgLoader");
    var bubbleButton = document.getElementById("bubbleButton");
    var squareButton = document.getElementById("squareButton");
    var thoughtButton = document.getElementById("thoughtButton");
    var boxButton = document.getElementById("boxButton");
    var dialogue = document.getElementById("dialogue");
    var textButton = document.getElementById("textButton");
    var styleSelect = document.getElementById("styleSelect");
    var fontSelect = document.getElementById("fontSelect");
    var colourText = document.getElementById("colour");
    var colourButton = document.getElementById("colourButton");
    var rmTextButton = document.getElementById("rmTextButton");
    var forwardButton = document.getElementById("forwardButton");
    var saveButton = document.getElementById("saveButton");
    var publishButton = document.getElementById("publishButton");
    //  var deleteButton = <HTMLButtonElement> document.getElementById("deleteButton");
    //  var deleteForm = <HTMLFormElement>document.getElementById("deleteForm");
    var saveProjectForm = document.getElementById("formSaveProject");
    var editor = new Editor(panels, imgLoader, bubbleButton, squareButton, thoughtButton, boxButton, dialogue, textButton, styleSelect, fontSelect, colourText, colourButton, rmTextButton, forwardButton, saveButton, saveProjectForm, publishButton);
    // load project is not defined
    if (loadProject == null) {
        editor.loadEmptyPanels();
        console.log("nothing");
    }
    else {
        editor.loadProject(loadProject);
        editor.setEditorID(loadProject[0]._id);
    }
};
