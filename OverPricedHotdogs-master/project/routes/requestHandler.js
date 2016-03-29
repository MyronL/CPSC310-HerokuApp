///<reference path='../types/DefinitelyTyped/node/node.d.ts'/>
///<reference path='../types/DefinitelyTyped/express/express.d.ts'/> 
var RequestHandler = (function () {
    function RequestHandler() {
    }
    RequestHandler.prototype.upload = function () {
        console.log("Request handler 'uplaod' was called.");
    };
    return RequestHandler;
})();
exports.RequestHandler = RequestHandler;
