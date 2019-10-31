const { expect } = require("chai");
const request = require("supertest");
const app = require("../app");

describe("Teamwork", () => {
  // gets json response
  describe("GET /", function() {
    it("responds with json", function() {
      return request(app)
        .get("/")
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200);
    });
  });

  // Admin can create an employee user account
  describe("POST /auth/create-user", function() {
    it("returns status code 201", function(done) {
      request(app)
        .post("/auth/create-user")
        .end(function(err, res) {
          expect(res.status).to.equal(201);
          done();
        });
    });
    it("responds with json data containing status success", function(done) {
      request(app)
        .post("/auth/create-user")
        .send({
          firstName: "string",
          lastName: "string",
          email: "string",
          password: "string",
          gender: "string",
          jobRole: "string",
          department: "string",
          address: "string"
        })
        .expect("Content-Type", /json/)
        .end(function(err, res) {
          if (err) return done(err);
          const {
            body: {
              status,
              data: { message, token, userId }
            }
          } = res;
          expect(res.status).to.equal(201);
          expect(status).to.equal("success");
          expect(message).to.equal("User account successfully created!");
          expect(token).to.be.a("string");
          expect(userId).to.be.a("number");
          expect(userId % 1).to.equal(0);
          done();
        });
    });
  });

  // Admin/Employee can signin
  describe("POST /auth/signin", function() {
    it("responds with status code 200", function(done) {
      request(app)
        .post("/auth/signin")
        .end(function(err, res) {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          done();
        });
    });
    it("returns json data containing status success", function(done) {
      request(app)
        .post("/auth/signin")
        .send({
          email: "string",
          password: "string"
        })
        .expect("Content-Type", /json/)
        .end(function(err, res) {
          if (err) return done(err);
          const {
            body: {
              status,
              data: { token, userId }
            }
          } = res;
          expect(status).to.equal("success");
          expect(token).to.be.a("string");
          expect(userId).to.be.a("number");
          expect(userId % 1).to.equal(0);
          done();
        });
    });
  });
  // employees can post gifs
  describe("POST /gifs", function() {
    it("responds with status code 201 - Creates a gif", function(done) {
      request(app)
        .post("/gifs")
        .end(function(err, res) {
          if (err) return done(err);
          expect(res.status).to.equal(201);
          done();
        });
    });
    it("returns json object with status success", function(done) {
      request(app)
        .post("/gifs")
        .set("header", "application/json")
        .expect("Content-Type", /json/)
        .end(function(err, res) {
          if (err) return done(err);
          const {
            body: {
              status,
              data: { gifId, message, createdOn, title, imageUrl }
            }
          } = res;
          expect(status).to.equal("success");
          expect(message).to.be.equal("GIF image successfully posted");
          expect(createdOn).to.be.a("string");
          expect(title).to.be.a("string");
          expect(imageUrl).to.be.a("string");
          expect(gifId).to.be.a("number");
          expect(gifId % 1).to.equal(0);
          done();
        });
    });
  });
});
