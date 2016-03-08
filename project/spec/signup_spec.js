var request = require("request");
var project = require("../app.js")

describe("Signup Page Test", function() {
	var signup_url = "http://localhost:3000/signup"
	var login_url = "http://localhost:3000/"
	
	describe("GET /", function() {

		it("returns status code 200", function() {
			request.get(signup_url, function(error, response, body) {
				expect(response.statusCode).toBe(200);
				done();
			});

		});
	});

	describe("Create a new user", function() {

		it("returns status code 200", function() {
			request.post(signup_url, {name:'josh', email:'josh@gmail.com', user:'jodhaaaa', pass:'1234567'}, function(error, response, body) {
				expect(response.statusCode).toEqual(200);
				expect(body).toEqual("ok");
				done();
			});
		});

		it ("logged in successfully", function() {
			request.post(login_url, {user:'jodhaaaa', pass:'1234567'}, function(error, response, body) {
				expect(response.statusCode).toEqual(200);
				done();
			});
		});
		
	});

	describe("Create a new user with duplicate username", function() {

		it("return status code 200", function() {
			request.post(signup_url, {name:'josh', email:'josh@gmail.com', user:'jodhaaaa', pass:'1234567'}, function(error, response, body) {
				expect(response.statusCode).toEqual(200);
				done();
			});
		});

		it("return status code 400 and error message", function() {
			request.post(signup_url, {name:'josh2', email:'josh2@gmail.com', user:'jodhaaaa', pass:'1234567'}, function(error, response, body) {
				expect(response.statusCode).toEqual(400);
				expect(body).toEqual("username-taken");
				done();
			});
		})

	});

	describe("Create a new user with a duplicate email", function() {

		it("return status code 200", function() {
			request.post(signup_url, {name:'josh', email:'josh@gmail.com', user:'jodhaaaa', pass:'1234567'}, function(error, response, body) {
				expect(response.statusCode).toEqual(200);
				done();
			});
		});

		it("return status code 400 and eoor message", function() {
			request.post(signup_url, {name:'josh2', email:'josh@gmail.com', user:'jodhaaaa2', pass:'1234567'}, function(error, response, body) {
				expect(response.statusCode).toEqual(400);
				expect(body).toEqual("email-taken");
				done();
			});
		})
	});

});