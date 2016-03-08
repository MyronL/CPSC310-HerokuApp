///<reference path='../types/DefinitelyTyped/node/node.d.ts'/>
///<reference path='../types/DefinitelyTyped/express/express.d.ts'/> 

import server = require('./server')
import requestHandler = require('./requestHandler')

var AM = require('./modules/account-manager');
var EM = require('./modules/email-dispatcher');

var ObjectId = require('mongodb').ObjectID;

class Router {
	
	constructor(){}

	start() {

		var express = require('express');
		var router = express.Router();


        server.start();
// main login page //
	router.get('/homepage', function(req, res) {
        var db = req.db;
        var projectlistCollection = db.get('EditingComic');        
        projectlistCollection.find({"published":"true"},{},function(e,docs){
           if (req.session.user == null){
	// if user is not logged-in redirect back to login page //
            //res.render('homepage', {  title: 'Home Page'});
			res.redirect('/homepagenl');
		  }else{
            res.redirect('/homepagenlLogin');
			/*
            res.render('homepagenl', {
				udata : req.session.user,
			});
            */
		  } 
        }); 
	});
    
    router.get('/homepagenlLogin', function(req,res){
        var db = req.db;
        var projectlistCollection = db.get('EditingComic');
        projectlistCollection.find({"published":"true"},{},function(e,docs){
            res.render('homepagenlLogin',{
               udata : req.session.user,
               "projectList": docs 
            });
        });                   
    });
    
	router.get('/homepagenl', function(req, res) {
		res.render('homepagenl', {  title: 'Home Page 1'});
	});


		/* GET login page. */
		router.get('/', function(req, res, next) {
	       // check if the user's credentials are saved in a cookie //
		  if (req.cookies.user == undefined || req.cookies.pass == undefined){
			 res.render('login', { title: 'Sign In' });
		  }else{
	       // attempt automatic login //
			AM.autoLogin(req.cookies.user, req.cookies.pass, function(o){
				if (o != null){
				    req.session.user = o;
					res.redirect('/homepage');
				}else{
				    res.render('login', { title: 'Sign In' });
				}
			});
		}
	});
    
	router.post('/', function(req, res){
		AM.manualLogin(req.body['user'], req.body['pass'], function(e, o){
			if (!o){
				res.status(400).send(e);
			}	else{
				req.session.user = o;
				if (req.body['remember-me'] == 'true'){
					res.cookie('user', o.user, { maxAge: 900000 });
					res.cookie('pass', o.pass, { maxAge: 900000 });
				}
				res.status(200).send(o);
			}
		});
	});

		/*
        router.get('/testProjectList', function(req,res,next){
          var db = req.db;
          var projectlistCollection = db.get('EditingComic');
          projectlistCollection.find({"author":"test"},{},function(e,docs){
              res.render('testProjectList',{
                 "projectList": docs 
              });
          });
        });
        */
    // logged-in user homepage //
	router.get('/home', function(req, res) {
        var db = req.db;
        var projectlistCollection = db.get('EditingComic');
        if (req.session.user == null) {
                    // if user is not logged-in redirect back to login page //
                    res.redirect('/');
            } else{
                var author = req.session.user.user; 
                projectlistCollection.find({ "author": author }, {}, function (e, docs) {
                  res.render('home', {
                        udata: req.session.user,
                        "projectList": docs
                    });
                });
            }
        });
	
	router.post('/home', function(req, res){
		if (req.body['user'] != undefined) {
			AM.updateAccount({
				user 	: req.body['user'],
				email 	: req.body['email'],
				pass	: req.body['pass'],
			}, function(e, o){
				if (e){
					res.status(400).send('error-updating-account');
				}	else{
					req.session.user = o;
			// update the user's login cookies if they exists //
					if (req.cookies.user != undefined && req.cookies.pass != undefined){
						res.cookie('user', o.user, { maxAge: 900000 });
						res.cookie('pass', o.pass, { maxAge: 900000 });	
					}
					res.status(200).send('ok');
				}
			});
		}	else if (req.body['logout'] == 'true'){
			res.clearCookie('user');
			res.clearCookie('pass');
			req.session.destroy(function(e){ res.status(200).send('ok'); });
		}
	});

// creating new accounts //
	
	router.get('/signup', function(req, res) {
		res.render('signup', {  title: 'Sign Up'});
	});
	
	router.post('/signup', function(req, res){
		AM.addNewAccount({
			name 	: req.body['name'],
			email 	: req.body['email'],
			user 	: req.body['user'],
			pass	: req.body['pass'],
		}, function(e){
			if (e){
				res.status(400).send(e);
			}	else{
				res.status(200).send('ok');
			}
		});
	});

// password reset //

	router.post('/lost-password', function(req, res){
	// look up the user's account via their email //
		AM.getAccountByEmail(req.body['email'], function(o){
			if (o){
				EM.dispatchResetPasswordLink(o, function(e, m){
				// this callback takes a moment to return //
				// TODO add an ajax loader to give user feedback //
					if (!e){
						res.status(200).send('ok');
					}	else{
						for (k in e) console.log('ERROR : ', k, e[k]);
						res.status(400).send('unable to dispatch password reset');
					}
				});
			}	else{
				res.status(400).send('email-not-found');
			}
		});
	});

	router.get('/reset-password', function(req, res) {
		var email = req.query["e"];
		var passH = req.query["p"];
		AM.validateResetLink(email, passH, function(e){
			if (e != 'ok'){
				res.redirect('/');
			} else{
	// save the user's email in a session instead of sending to the client //
				req.session.reset = { email:email, passHash:passH };
				res.render('reset', { title : 'Reset Password' });
			}
		})
	});
	
	router.post('/reset-password', function(req, res) {
		var nPass = req.body['pass'];
	// retrieve the user's email from the session to lookup their account and reset password //
		var email = req.session.reset.email;
	// destory the session immediately after retrieving the stored email //
		req.session.destroy();
		AM.updatePassword(email, nPass, function(e, o){
			if (o){
				res.status(200).send('ok');
			}	else{
				res.status(400).send('unable to update password');
			}
		})
	});
	
// view & delete accounts //
	
	router.get('/print', function(req, res) {
		AM.getAllRecords( function(e, accounts){
			res.render('print', { title : 'Account List', accts : accounts });
		})
	});
	
	router.post('/delete', function(req, res){
		AM.deleteAccount(req.body.id, function(e, obj){
			if (!e){
				res.clearCookie('user');
				res.clearCookie('pass');
				req.session.destroy(function(e){ res.status(200).send('ok'); });
			}	else{
				res.status(400).send('record not found');
			}
	    });
	});
	
	router.get('/reset', function(req, res) {
		AM.delAllRecords(function(){
			res.redirect('/print');	
		});
	});
	

// viewer
    //testing
    router.get('/viewer', function(req,res,next){
        if (req.session.user == null){
	       // if user is not logged-in redirect back to login page //
			res.redirect('/');
	    }else{  
        res.render('viewComic', {title: 'Viewer', "loadProject": null, udata : req.session.user});
        }
    });

    router.get('/viewer/:id', function(req,res,next){
        var comicID = req.params.id;
        var db = req.db;
        var projectlistCollection = db.get('EditingComic');
        if (req.session.user == null){
	       // if user is not logged-in redirect back to login page //
			res.redirect('/');
	    }else{        
            projectlistCollection.find({_id: ObjectId(comicID)},{},function(e,docs){
              res.render('viewComic',{
                 title: 'Viewer',
                 "loadProject": docs,
                 udata : req.session.user
              });
        });
        }        
    });
    
    //post comment
    router.post('/newComment' , function(req,res){
        var comicID = req.body.comicID;
        var comment = req.body.comment;
        var user = req.session.user.user;
        var db = req.db;
        var comicCollection = db.get('EditingComic');
        comicCollection.findAndModify({
                    _id: ObjectId(comicID)
                },{
                    $push: {
                     "commentList": comment+"   from   "+ user                       
                    }
                },function(err,doc){
                   if (err) {res.send("There was a problem adding the information to DB");
                } else {
                    res.redirect('/viewer/'+comicID);    
                }
                });
    });


// editor stuff	
        router.get('/editor', function(req, res, next) {
            if (req.session.user == null){
	       // if user is not logged-in redirect back to login page //
			res.redirect('/');
	       }else{  
            res.render('editor', { title: 'Editor', "loadProject" : null, "editorID": null, udata : req.session.user});
           }
        });
        
        router.get('/editor/:id', function(req,res,next){
           var editID = req.params.id;
           var db = req.db;
           var projectlistCollection = db.get('EditingComic');
           if (req.session.user == null){
	       // if user is not logged-in redirect back to login page //
			res.redirect('/');
	       }else{  
            projectlistCollection.find({_id: ObjectId(editID)},{},function(e,docs){
              res.render('editor',{
                 title: 'Editor',
                 "loadProject": docs,
                 udata : req.session.user
              });
           });
           }
        });

    // TODO: HELP ME I DON'T KNOW WHAT I'M DOING
    router.delete('/deleteProject/:id', function(req, res){
      var db = req.db;
      var comicID = req.params.id;
      var author = req.session.user.user;
      var projectlistCollection = db.get('EditingComic');
        if(comicID == "0"){
            res.status(400).send("Unable to Delete ");
        }
        projectlistCollection.remove(
          // stub for testing the removal of a specific project
          { "author": author, _id: ObjectId(comicID) },
          function(err, doc) {
              if (err) {
                console.log("Comic deletion failed");
            } else {
              console.log("Comic Deletion Successful");
              res.redirect('/home');
              }
          });
    });
              
         router.post('/saveProject', function(req,res){
            var editor_title = req.body.comicTitle;
            var editor_des = req.body.comicDescription;
            var editor_tags = req.body.comicTags;
            var panel1_JSON = req.body.sPanel1;
            var published = req.body.published;
            var thumbnail = req.body.thumbnail;
            var editorID = req.body.editorID;
            console.log(req.session.user.user);
            var db = req.db;
            var comicCollection = db.get('EditingComic');
            var author = req.session.user.user;
            
            console.log("updateField");
            console.log(editor_title);
            console.log("before"+editorID);
            if (editorID == "0"){
                comicCollection.insert({
                            "title": editor_title,
                            "author": author,
                            "description": editor_des,
                            "published": published,
                            "tags": editor_tags,
                            "panel1": panel1_JSON,
                            "thumbnail": thumbnail,
                            "commentList": []
                        }, function(err,doc){
                            if (err) {res.send("There was a problem adding the information to DB");}
                            else {
                                if (published == "true"){
                                    console.log("success publish");
                                    res.redirect('/homepage');  
                                } else {
                                    console.log("success save");
                                    res.redirect('/home');                                      
                                }
                                                  
                            }
                        });
            } else {
                console.log("in else case"+editorID);
                comicCollection.findAndModify({
                    _id: ObjectId(editorID)
                },{
                    $set: {
                     "title": editor_title,
                     "author": author,
                     "description": editor_des,
                     "published": published,
                     "tags": editor_tags,
                     "panel1": panel1_JSON,
                     "thumbnail": thumbnail                        
                    }
                },function(err,doc){
                   if (err) {res.send("There was a problem adding the information to DB");}
                   else {
                      if (published == "true"){
                           console.log("success publish");
                           res.redirect('/homepage');  
                      } else {
                           console.log("success save");
                           res.redirect('/home');                                      
                      }
                                                  
                   }
                });
            };
        });
    router.get('*', function(req, res) { res.render('404', { title: 'Page Not Found'}); });
		module.exports = router;
	}
}

var router = new Router()
router.start()