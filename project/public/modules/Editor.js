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
    function Editor(panel1, imgLoader) {
        var _this = this;
        this.panel1 = panel1;
        this.imgLoader = imgLoader;
        this.canvas1 = new fabric.Canvas(this.panel1);
        imgLoader.onchange = function (e) { return _this.showImage(e); };
        //this.tools = null;
        //this.editingComic = null;
        //this.selectedPanel = null;
        //return this;
    }
    //selectPanel = function(){
    //}
    Editor.prototype.showImage = function (e) {
        var canvas = this.canvas1;
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
            };
        };
        reader.readAsDataURL(e.target.files[0]);
    };
    return Editor;
})();
window.onload = function () {
    var panel1 = document.getElementById("panel1");
    var imgLoader = document.getElementById("imgLoader");
    var editor = new Editor(panel1, imgLoader);
};
