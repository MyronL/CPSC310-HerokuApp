///<reference path='../types/DefinitelyTyped/node/node.d.ts'/>
///<reference path='../types/DefinitelyTyped/express/express.d.ts'/> 

import server = require('./server')
import requestHandler = require('./requestHandler')

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
            res.render('editor', { title: 'Editor' });
        });

		module.exports = router;
	}
}

var router = new Router()
router.start()