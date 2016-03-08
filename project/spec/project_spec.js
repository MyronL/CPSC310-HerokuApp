var request = require("request");
var project = require("../app.js")

var login_url = "http://localhost:3000/"

describe("Login Page Test", function() {
	describe("GET /", function() {

		it("returns status code 200", function() {
			request.get(login_url, function(error, response, body) {
				expect(response.statusCode).toBe(200);
				done();
			});

		});
	});
});



