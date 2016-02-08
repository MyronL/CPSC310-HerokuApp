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
    function Editor(panels, imgLoader, bubbleButton, squareButton, thoughtButton, dialogue, textButton, colourText, colourButton, rmTextButton) {
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
                image.scaleToWidth(400);
                canvas.add(image);
                canvas.setActiveObject(image);
            };
        };
        reader.readAsDataURL(e.target.files[0]);
    };
    Editor.prototype.helperBubble = function () {
        console.log("helperBubble " + this.speech);
        var canvas1 = this.canvases[0];
        var canvas2 = this.canvases[1];
        var canvas3 = this.canvases[2];
        var canvas4 = this.canvases[3];
        fabric.Image.fromURL(this.speech, function (obj) {
            canvas1.on('mouse:down', function (b1) {
                canvas1.add(obj);
            });
            canvas1.setActiveObject(obj);
        });
        fabric.Image.fromURL(this.speech, function (obj2) {
            canvas2.on('mouse:down', function (b2) {
                canvas2.add(obj2);
            });
            canvas2.setActiveObject(obj2);
        });
        fabric.Image.fromURL(this.speech, function (obj3) {
            canvas3.on('mouse:down', function (b3) {
                canvas3.add(obj3);
            });
            canvas3.setActiveObject(obj3);
        });
        fabric.Image.fromURL(this.speech, function (obj4) {
            canvas4.on('mouse:down', function (b4) {
                canvas4.add(obj4);
            });
            canvas4.setActiveObject(obj4);
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
        if (removeThis instanceof fabric.Text) {
            this.canvases[0].remove(removeThis);
            this.canvases[0].renderAll();
        }
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
    var editor = new Editor(panels, imgLoader, bubbleButton, squareButton, thoughtButton, dialogue, textButton, colourText, colourButton, rmTextButton);
};
