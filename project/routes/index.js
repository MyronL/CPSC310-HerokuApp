///<reference path='../types/DefinitelyTyped/node/node.d.ts'/>
///<reference path='../types/DefinitelyTyped/express/express.d.ts'/> 
var server = require('./server');
var AM = require('./modules/account-manager');
var CT = require('./modules/country-list');
var EM = require('./modules/email-dispatcher');
var ObjectId = require('mongodb').ObjectID;
// REMEMBER TO RESTART NPM AND COMPILE TSC TO OBSERVE CHANGES
var Router = (function () {
    function Router() {
    }
    Router.prototype.start = function () {
        var express = require('express');
        var router = express.Router();
        server.start();
        // main login page //
        router.get('/homepage', function (req, res) {
            var db = req.db;
            var projectlistCollection = db.get('EditingComic');
            projectlistCollection.find({ "published": "true" }, {}, function (e, docs) {
                if (req.session.user == null) {
                    // if user is not logged-in redirect back to login page //
                    //res.render('homepage', {  title: 'Home Page'});
                    res.redirect('/');
                }
                else {
                    res.redirect('/homepagenlLogin');
                }
            });
        });
        // this is the homepage where we show the published comics/projects
        router.get('/homepagenlLogin', function (req, res) {
            var db = req.db;
            var accounts = db.get('accounts');
            accounts.findOne({ user: req.session.user.user }, function (e, o) {
                if (o.country == 'Viewer') {
                    console.log('hi');
                    res.redirect('/homepagenlLoginViewer');
                }
                else {
                    var projectlistCollection = db.get('EditingComic');
                    projectlistCollection.find({ "published": "true" }, {}, function (e, docs) {
                        res.render('homepagenlLogin', {
                            udata: req.session.user,
                            "projectList": docs,
                            title: "Published Project"
                        });
                    });
                }
            });
        });
        router.get('/topComic', function (req, res) {
            var db = req.db;
            var projectlistCollection = db.get('EditingComic');
            var accounts = db.get('accounts');
            if (req.session.user == null) {
                res.redirect('/');
            }
            projectlistCollection.find({}, { sort: { viewCount: -1 } }, function (e, docs) {
                accounts.findOne({ user: req.session.user.user }, function (e, o) {
                    if (o.country == 'Viewer') {
                        res.render('homepagenlLoginViewer', {
                            udata: req.session.user,
                            "projectList": docs,
                            title: "Top Viewed Comic"
                        });
                    }
                    else {
                        res.render('homepagenlLogin', {
                            udata: req.session.user,
                            "projectList": docs,
                            title: "Top Viewed Comic"
                        });
                    }
                });
            });
        });
        router.get('/homepagenlLoginViewer', function (req, res) {
            var db = req.db;
            var projectlistCollection = db.get('EditingComic');
            projectlistCollection.find({ "published": "true" }, {}, function (e, docs) {
                res.render('homepagenlLoginViewer', {
                    udata: req.session.user,
                    "projectList": docs,
                    title: "Published Comic"
                });
            });
            var projectlistCollection = db.get('EditingComic');
            //projectlistCollection.find().sort({ date: -1 });
            // gets only the published projects to display
            projectlistCollection.find({
                "published": "true" }, {}, function (e, docs) {
                res.render('homepagenlLogin', {
                    udata: req.session.user,
                    "projectList": docs
                });
            });
        });
        router.get('/homepagenl', function (req, res) {
            res.redirect('/');
        });
        /* GET login page. */
        router.get('/', function (req, res, next) {
            // check if the user's credentials are saved in a cookie //
            if (req.cookies.user == undefined || req.cookies.pass == undefined) {
                res.render('login', { title: 'Sign In' });
            }
            else {
                // attempt automatic login //
                AM.autoLogin(req.cookies.user, req.cookies.pass, function (o) {
                    if (o != null) {
                        req.session.user = o;
                        res.redirect('/homepage');
                    }
                    else {
                        res.render('login', { title: 'Sign In' });
                    }
                });
            }
        });
        router.post('/', function (req, res) {
            AM.manualLogin(req.body['user'], req.body['pass'], function (e, o) {
                if (!o) {
                    res.status(400).send(e);
                }
                else {
                    req.session.user = o;
                    if (req.body['remember-me'] == 'true') {
                        res.cookie('user', o.user, { maxAge: 900000 });
                        res.cookie('pass', o.pass, { maxAge: 900000 });
                    }
                    res.status(200).send(o);
                }
            });
        });
        // search the database for comics
        router.post('/searchComic', function (req, res, next) {
            var db = req.db;
            var search = req.body.search;
            var sortOption = req.body.sort;
            var projectlistCollection = db.get('EditingComic');
            if (sortOption == "new") {
                projectlistCollection.find({ $and: [{ $or: [{ title: { $regex: ".*" + search + ".*" } }, { author: { $regex: ".*" + search + ".*" } }, { tags: { $regex: ".*" + search + ".*" } }] }, { published: "true" }] }, { sort: { date: -1 } }, function (e, docs) {
                    console.log(search);
                    res.render('searchResult', {
                        "searchList": docs,
                        searchWord: search
                    });
                });
            }
            else if (sortOption == "old") {
                projectlistCollection.find({ $and: [{ $or: [{ title: { $regex: ".*" + search + ".*" } }, { author: { $regex: ".*" + search + ".*" } }, { tags: { $regex: ".*" + search + ".*" } }] }, { published: "true" }] }, { sort: { date: 1 } }, function (e, docs) {
                    res.render('searchResult', {
                        "searchList": docs,
                        searchWord: search
                    });
                });
            }
            else if (sortOption == "mFav") {
                projectlistCollection.find({ $and: [{ $or: [{ title: { $regex: ".*" + search + ".*" } }, { author: { $regex: ".*" + search + ".*" } }, { tags: { $regex: ".*" + search + ".*" } }] }, { published: "true" }] }, { sort: { favCount: -1 } }, function (e, docs) {
                    res.render('searchResult', {
                        "searchList": docs,
                        searchWord: search
                    });
                });
            }
            else if (sortOption == "lFav") {
                projectlistCollection.find({ $and: [{ $or: [{ title: { $regex: ".*" + search + ".*" } }, { author: { $regex: ".*" + search + ".*" } }, { tags: { $regex: ".*" + search + ".*" } }] }, { published: "true" }] }, { sort: { favCount: 1 } }, function (e, docs) {
                    res.render('searchResult', {
                        "searchList": docs,
                        searchWord: search
                    });
                });
            }
            else if (sortOption == "mView") {
                projectlistCollection.find({ $and: [{ $or: [{ title: { $regex: ".*" + search + ".*" } }, { author: { $regex: ".*" + search + ".*" } }, { tags: { $regex: ".*" + search + ".*" } }] }, { published: "true" }] }, { sort: { viewCount: -1 } }, function (e, docs) {
                    res.render('searchResult', {
                        "searchList": docs,
                        searchWord: search
                    });
                });
            }
            else if (sortOption == "lView") {
                projectlistCollection.find({ $and: [{ $or: [{ title: { $regex: ".*" + search + ".*" } }, { author: { $regex: ".*" + search + ".*" } }, { tags: { $regex: ".*" + search + ".*" } }] }, { published: "true" }] }, { sort: { viewCount: 1 } }, function (e, docs) {
                    res.render('searchResult', {
                        "searchList": docs,
                        searchWord: search
                    });
                });
            }
        });
        // logged-in user homepage //
        router.get('/home', function (req, res) {
            var db = req.db;
            var projectlistCollection = db.get('EditingComic');
            if (req.session.user == null) {
                // if user is not logged-in redirect back to login page //
                res.redirect('/');
            }
            else {
                // display the comics that the author has created
                var author = req.session.user.user;
                projectlistCollection.find({ "author": author }, {}, function (e, docs) {
                    res.render('home', {
                        title: 'Control Panel',
                        countries: CT,
                        udata: req.session.user,
                        "projectList": docs
                    });
                });
            }
        });
        // update the account info
        router.post('/home', function (req, res) {
            if (req.body['user'] != undefined) {
                AM.updateAccount({
                    user: req.body['user'],
                    email: req.body['email'],
                    pass: req.body['pass'],
                    country: req.body['country']
                }, function (e, o) {
                    if (e) {
                        res.status(400).send('error-updating-account');
                    }
                    else {
                        req.session.user = o;
                        // update the user's login cookies if they exists //
                        if (req.cookies.user != undefined && req.cookies.pass != undefined) {
                            res.cookie('user', o.user, { maxAge: 900000 });
                            res.cookie('pass', o.pass, { maxAge: 900000 });
                        }
                        res.status(200).send('ok');
                    }
                });
            }
            else if (req.body['logout'] == 'true') {
                res.clearCookie('user');
                res.clearCookie('pass');
                req.session.destroy(function (e) { res.status(200).send('ok'); });
            }
        });
        // creating new accounts //
        router.get('/signup', function (req, res) {
            res.render('signup', { title: 'Sign Up', countries: CT });
        });
        router.post('/signup', function (req, res) {
            AM.addNewAccount({
                name: req.body['name'],
                email: req.body['email'],
                user: req.body['user'],
                pass: req.body['pass'],
                country: req.body['country']
            }, function (e) {
                if (e) {
                    res.status(400).send(e);
                }
                else {
                    res.status(200).send('ok');
                }
            });
        });
        // password reset //
        router.post('/lost-password', function (req, res) {
            // look up the user's account via their email //
            AM.getAccountByEmail(req.body['email'], function (o) {
                if (o) {
                    EM.dispatchResetPasswordLink(o, function (e, m) {
                        // this callback takes a moment to return //
                        // TODO add an ajax loader to give user feedback //
                        if (!e) {
                            res.status(200).send('ok');
                        }
                        else {
                            for (k in e)
                                console.log('ERROR : ', k, e[k]);
                            res.status(400).send('unable to dispatch password reset');
                        }
                    });
                }
                else {
                    res.status(400).send('email-not-found');
                }
            });
        });
        router.get('/reset-password', function (req, res) {
            var email = req.query["e"];
            var passH = req.query["p"];
            AM.validateResetLink(email, passH, function (e) {
                if (e != 'ok') {
                    res.redirect('/');
                }
                else {
                    // save the user's email in a session instead of sending to the client //
                    req.session.reset = { email: email, passHash: passH };
                    res.render('reset', { title: 'Reset Password' });
                }
            });
        });
        router.post('/reset-password', function (req, res) {
            var nPass = req.body['pass'];
            // retrieve the user's email from the session to lookup their account and reset password //
            var email = req.session.reset.email;
            // destory the session immediately after retrieving the stored email //
            req.session.destroy();
            AM.updatePassword(email, nPass, function (e, o) {
                if (o) {
                    res.status(200).send('ok');
                }
                else {
                    res.status(400).send('unable to update password');
                }
            });
        });
        // view & delete accounts //
        router.get('/print', function (req, res) {
            AM.getAllRecords(function (e, accounts) {
                res.render('print', { title: 'Account List', accts: accounts });
            });
        });
        router.post('/delete', function (req, res) {
            AM.deleteAccount(req.body.id, function (e, obj) {
                if (!e) {
                    res.clearCookie('user');
                    res.clearCookie('pass');
                    req.session.destroy(function (e) { res.status(200).send('ok'); });
                }
                else {
                    res.status(400).send('record not found');
                }
            });
        });
        router.get('/reset', function (req, res) {
            AM.delAllRecords(function () {
                res.redirect('/print');
            });
        });
        // viewer
        //testing
        /*
        router.get('/viewer', function(req,res,next){
            if (req.session.user == null){
             // if user is not logged-in redirect back to login page //
          res.redirect('/');
          }else{
            res.render('viewComic', {title: 'Viewer', "loadProject": null, udata : req.session.user});
            }
        });
        */
        router.get('/viewer/:id', function (req, res, next) {
            var comicID = req.params.id;
            var db = req.db;
            var projectlistCollection = db.get('EditingComic');
            var favCollection = db.get('favorites');
            var user = req.session.user.user;
            var favRecord = 0;
            var sameSeries = null;
            if (req.session.user == null) {
                // if user is not logged-in redirect back to login page //
                res.redirect('/');
            }
            else {
                // increments view count per view           
                projectlistCollection.update({ _id: ObjectId(comicID) }, { $inc: { "viewCount": 1 } });
                // gets the favourite count from the favourite collection
                projectlistCollection.find({ _id: ObjectId(comicID) }, {}, function (e, docs) {
                    favCollection.count({ "comicID": comicID }, function (e, count) {
                        favCollection.findOne({ "user": user, "comicID": comicID }, function (e, o) {
                            if (o) {
                                favRecord = 1;
                            }
                            var sameSeries = docs[0].series;
                            var series = [];
                            // updates favCount field in the comicCollection
                            projectlistCollection.findAndModify({ _id: ObjectId(comicID) }, { $set: { "favCount": count } });
                            projectlistCollection.find({ "series": sameSeries }, function (e, doc) {
                                series = doc;
                                // renders the different variables to viewComic
                                res.render('viewComic', { title: 'Viewer',
                                    "loadProject": docs,
                                    udata: req.session.user,
                                    "series": series,
                                    liked: favRecord,
                                    favCount: count });
                            });
                        });
                    });
                });
            }
        });
        //like a comic
        router.post('/favorites', function (req, res) {
            var comicID = req.body.comicID;
            var user = req.session.user.user;
            var liked = req.body.like;
            var db = req.db;
            var favCollection = db.get('favorites');
            if (liked == 1) {
                favCollection.insert({ "user": user, "comicID": comicID }, function (err, doc) {
                    if (err) {
                        res.send("There was a problem adding the information to DB");
                    }
                    else {
                        res.redirect('/viewer/' + comicID);
                    }
                });
            }
            else {
                favCollection.remove({ "user": user, "comicID": comicID }, function (err, doc) {
                    if (err) {
                        res.send("There was a problem deleting a document in DB");
                    }
                    else {
                        res.redirect('/viewer/' + comicID);
                    }
                });
            }
        });
        router.get('/favorites', function (req, res) {
            var db = req.db;
            var favCollection = db.get('favorites');
            var projectlistCollection = db.get('EditingComic');
            var user = req.session.user.user;
            var comics = [];
            //var favList = [];
            if (req.session.user == null) {
                res.redirect('/');
            }
            else {
                favCollection.find({ "user": user })
                    .each(function (o) {
                    comics.push(o.comicID);
                })
                    .success(function () {
                    var obj_ids = comics.map(function (item) {
                        return ObjectId(item);
                    });
                    projectlistCollection.find({ _id: { "$in": obj_ids } }, function (e, doc) {
                        res.render('homepagenlLogin', { udata: req.session.user, "projectList": doc, title: "My Favorite Comic" });
                    });
                });
            }
        });
        //post comment
        router.post('/newComment', function (req, res) {
            var comicID = req.body.comicID;
            var comment = req.body.comment;
            var user = req.session.user.user;
            var db = req.db;
            var comicCollection = db.get('EditingComic');
            comicCollection.findAndModify({
                _id: ObjectId(comicID)
            }, {
                $push: {
                    "commentList": comment + "   from   " + user
                }
            }, function (err, doc) {
                if (err) {
                    res.send("There was a problem adding the information to DB");
                }
                else {
                    res.redirect('/viewer/' + comicID);
                }
            });
        });
        // editor stuff  
        router.get('/editor', function (req, res, next) {
            var db = req.db;
            var user = req.session.user.user;
            var seriesCollection = db.get('Series');
            var userSeries = null;
            if (req.session.user == null) {
                // if user is not logged-in redirect back to login page //
                res.redirect('/');
            }
            else {
                seriesCollection.findOne({ "user": user }, {}, function (e, docs) {
                    userSeries = docs;
                    console.log(e);
                    console.log(userSeries);
                    res.render('editor', { title: 'Editor', "loadProject": null, "editorID": null, "userSeries": userSeries, udata: req.session.user });
                });
            }
        });
        router.get('/editor/:id', function (req, res, next) {
            var editID = req.params.id;
            var db = req.db;
            var user = req.session.user.user;
            var projectlistCollection = db.get('EditingComic');
            var seriesCollection = db.get('Series');
            var userSeries = null;
            if (req.session.user == null) {
                // if user is not logged-in redirect back to login page //
                res.redirect('/');
            }
            else {
                seriesCollection.findOne({ "user": user }, {}, function (e, docs) {
                    userSeries = docs;
                    projectlistCollection.find({ _id: ObjectId(editID) }, {}, function (e, docs) {
                        res.render('editor', {
                            title: 'Editor',
                            "loadProject": docs,
                            "userSeries": userSeries,
                            udata: req.session.user
                        });
                    });
                });
            }
        });
        // Delete a comic
        router.delete('/deleteProject/:id', function (req, res) {
            var db = req.db;
            var comicID = req.params.id;
            var author = req.session.user.user;
            var projectlistCollection = db.get('EditingComic');
            if (comicID == "0") {
                res.status(400).send("Unable to Delete ");
            }
            projectlistCollection.remove(
            // stub for testing the removal of a specific project
            { "author": author, _id: ObjectId(comicID) }, function (err, doc) {
                if (err) {
                    console.log("Comic Deletion Failed");
                }
                else {
                    console.log("Comic Deletion Successful");
                    res.redirect('/home');
                }
            });
        });
        // save a project
        router.post('/saveProject', function (req, res) {
            var editor_title = req.body.comicTitle;
            var editor_des = req.body.comicDescription;
            var editor_tags = req.body.comicTags;
            var panel1_JSON = req.body.sPanel1;
            var published = req.body.published;
            var thumbnail = req.body.thumbnail;
            var editorID = req.body.editorID;
            var series = req.body.seriesSelect;
            var newSeries = req.body.newSeries;
            var insertSeries = null;
            //console.log("series:"+series);
            //console.log("newSeries:"+newSeries);
            //console.log(req.session.user.user);
            var db = req.db;
            var comicCollection = db.get('EditingComic');
            var seriesCollection = db.get('Series');
            var author = req.session.user.user;
            var date = new Date(Date.now());
            if (series == "") {
                insertSeries = newSeries;
                seriesCollection.findAndModify({
                    "user": author
                }, {
                    $push: {
                        "series": newSeries
                    }
                }, function (err, doc) {
                    if (doc == null) {
                        seriesCollection.insert({ "user": author, "series": [newSeries] });
                    }
                });
            }
            else {
                insertSeries = series;
            }
            //console.log("updateField");
            //console.log(editor_title);
            //console.log("before"+editorID);
            if (editorID == "0") {
                comicCollection.insert({
                    "title": editor_title,
                    "author": author,
                    "description": editor_des,
                    "published": published,
                    "tags": editor_tags,
                    "panel1": panel1_JSON,
                    "thumbnail": thumbnail,
                    "commentList": [],
                    "series": insertSeries,
                    "viewCount": 0,
                    "favCount": 0,
                    "date": date
                }, function (err, doc) {
                    if (err) {
                        res.send("There was a problem adding the information to DB");
                    }
                    else {
                        if (published == "true") {
                            console.log("success publish");
                            res.redirect('/homepage');
                        }
                        else {
                            console.log("success save");
                            res.redirect('/home');
                        }
                    }
                });
            }
            else {
                //console.log("in else case"+editorID);
                comicCollection.findAndModify({
                    _id: ObjectId(editorID)
                }, {
                    $set: {
                        "title": editor_title,
                        "author": author,
                        "description": editor_des,
                        "published": published,
                        "tags": editor_tags,
                        "panel1": panel1_JSON,
                        "series": insertSeries,
                        "thumbnail": thumbnail,
                        "date": date
                    }
                }, function (err, doc) {
                    if (err) {
                        res.send("There was a problem adding the information to DB");
                    }
                    else {
                        if (published == "true") {
                            console.log("success publish");
                            res.redirect('/homepage');
                        }
                        else {
                            console.log("success save");
                            res.redirect('/home');
                        }
                    }
                });
            }
            ;
        });
        router.get('*', function (req, res) { res.render('404', { title: 'Page Not Found' }); });
        module.exports = router;
    };
    return Router;
})();
var router = new Router();
router.start();
