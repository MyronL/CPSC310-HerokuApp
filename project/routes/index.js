///<reference path='../types/DefinitelyTyped/node/node.d.ts'/>
///<reference path='../types/DefinitelyTyped/express/express.d.ts'/> 
var server = require('./server');
var Router = (function () {
    function Router() {
    }
    Router.prototype.start = function () {
        var express = require('express');
        var router = express.Router();
        server.start();
        /* GET home page. */
        router.get('/', function (req, res, next) {
            res.render('index', { title: 'Express' });
        });
        /* Get editor page*/
        router.get('/editor', function (req, res, next) {
            res.render('editor', { title: 'Editor' });
        });
        module.exports = router;
    };
    return Router;
})();
var router = new Router();
router.start();
