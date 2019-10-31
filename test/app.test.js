const { expect } = require("chai");
const request = require("supertest");
const app = require("../app");

describe("Teamwork", () => {
  // gets json response
  describe("GET /", () => {
    it("responds with json", () => request(app)
      .get("/")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200));
  });

  // Admin can create an employee user account
  describe("POST /auth/create-user", () => {
    it("returns status code 201", done => {
      request(app)
        .post("/auth/create-user")
        .end((err, {status}) => {
          expect(status).to.equal(201);
          done();
        });
    });
    it("responds with json data containing status success", done => {
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
        .end((err, res) => {
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
  describe("POST /auth/signin", () => {
    it("responds with status code 200", done => {
      request(app)
        .post("/auth/signin")
        .end((err, {status}) => {
          if (err) return done(err);
          expect(status).to.equal(200);
          done();
        });
    });
    it("returns json data containing status success", done => {
      request(app)
        .post("/auth/signin")
        .send({
          email: "string",
          password: "string"
        })
        .expect("Content-Type", /json/)
        .end((err, res) => {
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
});
