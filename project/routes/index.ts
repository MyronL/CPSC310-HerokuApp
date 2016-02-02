///<reference path='../types/DefinitelyTyped/node/node.d.ts'/>
///<reference path='../types/DefinitelyTyped/express/express.d.ts'/> 

class Router {
	
	constructor(){}

	start() {

		var express = require('express');
		var router = express.Router();

		/* GET home page. */
		router.get('/', function(req, res, next) {
		  res.render('index', { title: 'Express' });
		});

		module.exports = router;
	}
}

var router = new Router()
router.start()