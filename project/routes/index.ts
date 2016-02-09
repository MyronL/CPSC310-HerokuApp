///<reference path='../types/DefinitelyTyped/node/node.d.ts'/>
///<reference path='../types/DefinitelyTyped/express/express.d.ts'/> 

import server = require('./server')
import requestHandler = require('./requestHandler')
var ObjectId = require('mongodb').ObjectID;

class Router {
	
	constructor(){}

	start() {

		var express = require('express');
		var router = express.Router();


        server.start();

		/* GET home page. */
		router.get('/', function(req, res, next) {
		  res.render('index', { title: 'Express' });
		});

        router.get('/editor', function(req, res, next) {
            res.render('editor', { title: 'Editor', "loadProject" : null });
        });
        
        router.get('/editor/:id', function(req,res,next){
           var editID = req.params.id;
           var db = req.db;
           var projectlistCollection = db.get('EditingComic');
           projectlistCollection.find({_id: ObjectId(editID)},{},function(e,docs){
              res.render('editor',{
                 title: 'Editor',
                 "loadProject": docs 
              });
           });
        });

        router.get('/testProjectList', function(req,res,next){
          var db = req.db;
          var projectlistCollection = db.get('EditingComic');
          projectlistCollection.find({"author":"test"},{},function(e,docs){
              res.render('testProjectList',{
                 "projectList": docs 
              });
          });
        });
        router.post('/saveProject', function(req,res){
            var editor_title = req.body.comicTitle;
            var editor_des = req.body.comicDescription;
            var editor_tags = req.body.comicTags;
            var panel1_JSON = req.body.sPanel1;
            var panel2_JSON = req.body.sPanel2;
            var panel3_JSON = req.body.sPanel3;
            var panel4_JSON = req.body.sPanel4;
            var published = req.body.published;
            var db = req.db;
            var comicCollection = db.get('EditingComic');
            var author = "test"
            
            console.log("updateField");
            console.log(editor_title);
            comicCollection.insert({
                            "title": editor_title,
                            "author": "test",
                            "description": editor_des,
                            "published": published,
                            "tags": editor_tags,
                            "panel1": panel1_JSON,
                            "panel2": panel2_JSON,
                            "panel3": panel3_JSON,
                            "panel4": panel4_JSON
                        }, function(err,doc){
                            if (err) {res.send("There was a problem adding the information to DB");}
                            else {
                                if (published == "true"){
                                    console.log("success publish");
                                    res.redirect('/');  
                                } else {
                                    console.log("success save");
                                    res.redirect('/testProjectList');                                      
                                }
                                                  
                            }
                        });
            /*
            if (published == "true") {
                        comicCollection.insert({
                            "title": editor_title,
                            "author": "test",
                            "description": editor_des,
                            "published": published,
                            "tags": editor_tags,
                            "panel1": panel1_JSON,
                            "panel2": panel2_JSON,
                            "panel3": panel3_JSON,
                            "panel4": panel4_JSON
                        }, function(err,doc){
                            if (err) {res.send("There was a problem adding the information to DB");}
                            else {
                                console.log("publish");
                                res.redirect('/');                    
                            }
                        });
                    } else {
                        comicCollection.insert({
                            "title": editor_title,
                            "author": "test",
                            "description": editor_des,
                            "published": published,
                            "tags": editor_tags,
                            "panel1": panel1_JSON,
                            "panel2": panel2_JSON,
                            "panel3": panel3_JSON,
                            "panel4": panel4_JSON
                        }, function(err,doc){
                            if (err) {res.send("There was a problem adding the information to DB");}
                            else {
                                console.log("success");
                                res.redirect('/testProjectList');                    
                            }
                        });
                    }      
                    */    
        });
		module.exports = router;
	}
}

var router = new Router()
router.start()