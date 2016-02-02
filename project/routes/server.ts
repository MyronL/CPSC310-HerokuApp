///<reference path='../types/DefinitelyTyped/node/node.d.ts'/>
///<reference path='../types/DefinitelyTyped/express/express.d.ts'/> 
export class Server {

    constructor(){}

    start() {
        var http = require("http")

    	function onRequest(request, response) {
    		response.writeHead(200, {"Content-Type": "text/plain"});
    		response.write("Hello World");
    		response.end();
    	}

    	http.createServer(onRequest).listen(8888);   

    }    
}

