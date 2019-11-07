const { expect } = require("chai");
const request = require("supertest");
const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");
const db = require("../api/controllers/db");
const user = require("./data");
const app = require("../app");

describe("Teamwork", () => {
  let userToken;
  let employeeid;
  before(done => {
    db.none("TRUNCATE TABLE employee CASCADE").then(() => {
      db.one(
        // insert in a default user
        `INSERT INTO employee (${Object.keys(user.defaultUser).join(
          ", "
        )}) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING employeeid`,
        Object.values(user.defaultUser)
      ).then(val => {
        // generate token for default user
        employeeid = val.employeeid;
        userToken = jwt.sign(
          { userid: val.employeeid },
          "RANDOM_TOKEN_SECRET",
          {
            expiresIn: "1h"
          }
        );
        done();
      });
    });
  });
  // gets json response
  describe("GET /", () => {
    it("responds with json", done => {
      request(app)
        .get("/api/v1/")
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          if (err) return done(err);
          done();
        });
    });
  });
  // Admin can create an employee user account
  describe("POST /auth/create-user", () => {
    it("respond with status 201 and returns json data containing token", done => {
      request(app)
        .post("/api/v1/auth/create-user")
        .send(user.testUser1)
        .expect("Content-Type", /json/)
        .then(res => {
          const {
            body: {
              status,
              data: { message, token, userId }
            }
          } = res;
          expect(res.status).to.equal(201);
          expect(status).to.equal("success");
          expect(message).to.equal("User account successfully created");
          expect(token).to.be.a("string");
          expect(userId).to.be.a("number");
          expect(userId % 1).to.equal(0);
          done();
        })
        .catch(err => done(err));
    });
  });
  // User can sign in
  describe("POST /auth/signin", () => {
    before(done => {
      bcrypt.hash(user.testUser2.password, 10).then(password => {
        const {
          firstName,
          lastName,
          email,
          gender,
          jobRole,
          department,
          address
        } = user.testUser2;
        db.one({
          text:
            "INSERT INTO employee (firstname, lastname, email, password, gender, job_role, department, address) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING email, password, employeeid",
          values: [
            firstName,
            lastName,
            email,
            password,
            gender,
            jobRole,
            department,
            address
          ]
        });
        done();
      });
    });

    it("responds with status code 200 and returns json data containing token", done => {
      request(app)
        .post("/api/v1/auth/signin")
        .send(user.userLogin)
        .expect("Content-Type", /json/)
        .end((err, res) => {
          if (err) return done(err);
          const {
            body: {
              status,
              data: { token, userId }
            }
          } = res;
          expect(res.status).to.equal(200);
          expect(status).to.equal("success");
          expect(token).to.be.a("string");
          expect(userId).to.be.a("number");
          expect(userId % 1).to.equal(0);
          done();
        });
    });
  });
});
