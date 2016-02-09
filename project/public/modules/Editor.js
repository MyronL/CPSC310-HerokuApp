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
var Editor = (function () {
    function Editor(panels, imgLoader, bubbleButton, squareButton, thoughtButton, dialogue, textButton, colourText, colourButton, rmTextButton, saveButton, saveProjectForm, publishButton) {
        var _this = this;
        this.bubble = 'http://i.imgur.com/qtDmgzK.png';
        this.square = 'http://i.imgur.com/Co7HFts.png';
        this.thought = 'http://i.imgur.com/EZruJfs.png';
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
        this.saveButton = saveButton;
        this.publishButton = publishButton;
        this.saveProjectForm = saveProjectForm;
        this.canvases = [];
        for (var i = 0; i < 4; i++) {
            this.canvases.push(new fabric.Canvas(this.panels[i]));
        }
        imgLoader.onchange = function (e) { return _this.showImage(e); };
        bubbleButton.onclick = function () { return _this.clickBubbleButton(); };
        squareButton.onclick = function () { return _this.clickSquareButton(); };
        thoughtButton.onclick = function () { return _this.clickThoughtButton(); };
        textButton.onclick = function () { return _this.addText(); };
        colourButton.onclick = function () { return _this.setColour(); };
        rmTextButton.onclick = function () { return _this.removeSelected(); };
        saveButton.onclick = function () { return _this.saveProject(); };
        publishButton.onclick = function () { return _this.publishProject(); };
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
        });
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
    Editor.prototype.addText = function () {
        var text = this.dialogue.value;
        var textToAdd = new fabric.Text(text, {
            fontFamily: 'Comic Sans'
        });
        this.canvases[0].add(textToAdd);
        this.canvases[0].setActiveObject(textToAdd);
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
    Editor.prototype.publishProject = function () {
        this.saveProjectForm.elements['published'].value = true;
        this.saveProjectForm.elements['sPanel1'].value = JSON.stringify(this.canvases[0]);
        //   console.log(JSON.stringify(this.canvases[0]));
        this.saveProjectForm.elements['sPanel2'].value = JSON.stringify(this.canvases[1]);
        this.saveProjectForm.elements['sPanel3'].value = JSON.stringify(this.canvases[2]);
        this.saveProjectForm.elements['sPanel4'].value = JSON.stringify(this.canvases[3]);
        this.saveProjectForm.submit();
    };
    Editor.prototype.saveProject = function () {
        /*    this.canvases[0].forEachObject(function(obj){
                obj.sourcePath = '/uploadIMG/FILE.svg';
                console.log(obj.sourcePath);
            });
            */
        this.saveProjectForm.elements['published'].value = false;
        this.saveProjectForm.elements['sPanel1'].value = JSON.stringify(this.canvases[0]);
        //   console.log(JSON.stringify(this.canvases[0]));
        this.saveProjectForm.elements['sPanel2'].value = JSON.stringify(this.canvases[1]);
        this.saveProjectForm.elements['sPanel3'].value = JSON.stringify(this.canvases[2]);
        this.saveProjectForm.elements['sPanel4'].value = JSON.stringify(this.canvases[3]);
        this.saveProjectForm.submit();
    };
    Editor.prototype.loadProject = function (loadProject) {
        var title = loadProject[0].title;
        var description = loadProject[0].description;
        var tags = loadProject[0].tags;
        var author = loadProject[0].author;
        var JsonPanel1 = loadProject[0].panel1;
        var JsonPanel2 = loadProject[0].panel2;
        var JsonPanel3 = loadProject[0].panel3;
        var JsonPanel4 = loadProject[0].panel4;
        console.log(title);
        $('#comicTitle').val(title);
        $('#comicDescription').val(description);
        $('#comicTags').val(tags);
        console.log(loadProject[0]);
        this.canvases[0].loadFromJSON(JsonPanel1, this.canvases[0].renderAll.bind(this.canvases[0]));
    };
    return Editor;
})();
window.onload = function () {
    var panels = [];
    panels.push(document.getElementById("panel1"));
    panels.push(document.getElementById("panel2"));
    panels.push(document.getElementById("panel3"));
    panels.push(document.getElementById("panel4"));
    var imgLoader = document.getElementById("imgLoader");
    var bubbleButton = document.getElementById("bubbleButton");
    var squareButton = document.getElementById("squareButton");
    var thoughtButton = document.getElementById("thoughtButton");
    var dialogue = document.getElementById("dialogue");
    var textButton = document.getElementById("textButton");
    var colourText = document.getElementById("colour");
    var colourButton = document.getElementById("colourButton");
    var rmTextButton = document.getElementById("rmTextButton");
    var saveButton = document.getElementById("saveButton");
    var publishButton = document.getElementById("publishButton");
    var saveProjectForm = document.getElementById("formSaveProject");
    var editor = new Editor(panels, imgLoader, bubbleButton, squareButton, thoughtButton, dialogue, textButton, colourText, colourButton, rmTextButton, saveButton, saveProjectForm, publishButton);
    if (loadProject == null) {
        console.log("nothing");
    }
    else {
        editor.loadProject(loadProject);
    }
};
