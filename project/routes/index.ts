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
		res.render('homepage', {  title: 'Home Page'});
		if (req.session.user == null){
	// if user is not logged-in redirect back to login page //
			res.redirect('/homepagenl');
		}	else{
			res.render('homepagenl', {
				udata : req.session.user
			});
		}
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

	
// logged-in user homepage //
	
	router.get('/home', function(req, res) {
		if (req.session.user == null){
	// if user is not logged-in redirect back to login page //
			res.redirect('/');
		}	else{
			res.render('home', {
				udata : req.session.user
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
	
	router.get('*', function(req, res) { res.render('404', { title: 'Page Not Found'}); });

// editor stuff	
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
        });
		module.exports = router;
	}
}

var router = new Router()
router.start()