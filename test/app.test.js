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
  // employees can write and/or share articles
  describe("POST /articles", function() {
    it("responds with status code 201 - creates article", function(done) {
      request(app)
        .post("/articles")
        .end(function(err, res) {
          expect(res.status).to.equal(201);
          done();
        });
    });
    it("returns json object containing status success", function(done) {
      request(app)
        .post("/articles")
        .set("header", "application/json")
        .send({
          title: "string",
          article: "string"
        })
        .expect("Content-Type", /json/)
        .end(function(err, res) {
          if (err) return done(err);
          const {
            body: {
              status,
              data: { message, articleId, createdOn, title }
            }
          } = res;
          expect(status).to.equal("success");
          expect(message).to.be.equal("Article successfully posted");
          expect(createdOn).to.be.a("string");
          expect(title).to.be.a("string");
          expect(articleId).to.be.a("number");
          expect(articleId % 1).to.equal(0);
          done();
        });
    });
  });
  // employees can edit their article
  describe("PATCH /articles/<:articleId>", function() {
    it("responds with status code 200 - can edit article", function(done) {
      request(app)
        .patch("/articles/:articleId")
        .end(function(err, res) {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          done();
        });
    });
    it("returns json data containing status success", function(done) {
      request(app)
        .patch("/articles/:articleId")
        .set("header", "application/json")
        .send({
          title: "string",
          article: "string"
        })
        .expect("Content-Type", /json/)
        .end(function(err, res) {
          if (err) return done(err);
          const {
            body: {
              status,
              data: { message, title, article }
            }
          } = res;
          expect(status).to.equal("success");
          expect(message).to.be.equal("Article successfully updated");
          expect(title).to.be.a("string");
          expect(article).to.be.a("string");
          done();
        });
    });
  });
  // employees can delete their articles
  describe("DELETE /articles/<:articleId>", function() {
    it("returns json data and responds with status code 200", function(done) {
      request(app)
        .delete("/articles/:articleId")
        .set("header", "application/json")
        .expect("Content-Type", /json/)
        .end(function(err, res) {
          if (err) return done(err);
          const {
            body: {
              status,
              data: { message }
            }
          } = res;
          expect(res.status).to.equal(200);
          expect(status).to.equal("success");
          expect(message).to.be.equal("Article successfully deleted");
          done();
        });
    });
  });
});

// employees can delete their gif
describe("DELETE /gifs/<:gifId>", function() {
  it("responds with status code 200 and returns json object", function(done) {
    request(app)
      .delete("/gifs/:gifId")
      .set("header", "application/json")
      .expect("Content-Type", /json/)
      .end(function(err, res) {
        if (err) return done(err);
        const {
          body: {
            status,
            data: { message }
          }
        } = res;
        expect(res.status).to.equal(200);
        expect(status).to.equal("success");
        expect(message).to.be.equal("gif post successfully deleted");
        done();
      });
  });
});
