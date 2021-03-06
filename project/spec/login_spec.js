var request = require("request");
var project = require("../app.js")

<<<<<<< HEAD
var login_url = "http://overpricedcomics.herokuapp.com/"
var signup_url = "http://overpricedcomics.herokuapp.com/signup"
=======
var login_url = "http://localhost:3000/"
var signup_url = "http://localhost:3000/signup"
>>>>>>> 10df194ac7f674745b017bd758634e0449af7237

describe("Login Page Test", function() {
	describe("GET /", function() {

		it("returns status code 200", function() {
			request.get(login_url, function(error, response, body) {
				expect(response.statusCode).toBe(200);
				done();
			});

		});
	});

	describe("Login with a wrong account", function() {

		it("returns user-not-found", function() {
			request.post(login_url, {user:'no', pass:'no'}, function(error, response, body) {
				expect(response.statusCode).toEqual(400);
				expect(body).toEqual("user-not-found");
				done();
			});
		});
		
		request.post(signup_url, {name:'josh', email:'josh@gmail.com', user:'jodhaaaa', pass:'1234567'});

		it("returns invalid-password", function() {
			request.post(login_url, {user:'jodhaaaa', pass:'no'}, function(error, response, body) {
				expect(response.statusCode).toEqual(400);
				expect(body).toEqual("invalid-password");
				done();
			});
		});

	});
});



