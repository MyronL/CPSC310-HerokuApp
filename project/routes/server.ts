///<reference path='../types/DefinitelyTyped/node/node.d.ts'/>
///<reference path='../types/DefinitelyTyped/express/express.d.ts'/> 
class Server {

    constructor(){}

    start() {
        var http = require("http")

    	function onRequest(request, response) {
    		response.writeHead(200, {"Content-Type": "text/plain"});
    		response.write("Test!!!");
    		response.end();
    	}

    	http.createServer(onRequest).listen(8888);   

    }    
}

var server = new Server()
export = server