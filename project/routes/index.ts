///<reference path='../types/DefinitelyTyped/node/node.d.ts'/>
///<reference path='../types/DefinitelyTyped/express/express.d.ts'/> 

import s = require('./server')

class Router {
	
	constructor(){}

	start() {

		var express = require('express');
		var router = express.Router();
		var server = new s.Server();

        server.start();

		/* GET home page. */
		router.get('/', function(req, res, next) {
		  res.render('index', { title: 'Express' });
		});

		module.exports = router;
	}
}

var router = new Router()
router.start()