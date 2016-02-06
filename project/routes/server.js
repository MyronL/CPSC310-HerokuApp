///<reference path='../types/DefinitelyTyped/node/node.d.ts'/>
///<reference path='../types/DefinitelyTyped/express/express.d.ts'/> 
var Server = (function () {
    function Server() {
    }
    Server.prototype.start = function () {
        var http = require("http");
        function onRequest(request, response) {
            response.writeHead(200, { "Content-Type": "text/plain" });
            response.write("Test!!!");
            response.end();
        }
        http.createServer(onRequest).listen(8888);
    };
    return Server;
})();
var server = new Server();
module.exports = server;
