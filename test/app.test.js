const { expect } = require("chai");
const request = require("supertest");
const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");
// const cloudinary = require("cloudinary");
const db = require("../api/controllers/db");
const user = require("./data");

const app = require("../app");

describe("Teamwork", () => {
  let userToken;
  let employeeid;
  before(done => {
    db.none("TRUNCATE TABLE article CASCADE").then(() => {
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
  // employees can Post gifs
  describe("POST /gifs", () => {
    before(() => {
      db.none("TRUNCATE TABLE gif CASCADE");
    });
    //  it("successfully uploads gif to cloudinary", done => {
    //  request(app)
    //    .post("/gifs")
    //    .set("header", "application/json")
    //    .attach("imgUrl", "./image")
    //    .end((err, req) => {
    //      if (err) return done(err);
    //      const {
    //        body: { image }
    //      } = req;
    //      expect(image).to.be.an("url");
    //      done();
    //    });
    //  });
    it("responds with status 201 and returns json object", done => {
      request(app)
        .post("/api/v1/gifs")
        .set("authorization", userToken)
        .send(user.testGif)
        .expect("Content-Type", /json/)
        .end((err, res) => {
          if (err) return done(err);
          const {
            body: {
              status,
              data: { gifid, message, createdOn, title, imageUrl }
            }
          } = res;
          expect(res.status).to.equal(200);
          expect(status).to.equal("success");
          expect(message).to.be.equal("GIF image successfully posted");
          expect(createdOn).to.be.a("string");
          expect(title).to.be.a("string");
          expect(imageUrl).to.be.a("string");
          expect(gifid).to.be.a("number");
          expect(gifid % 1).to.equal(0);
          done();
        });
    });
  });
  // employees can create article
  describe("POST /articles", () => {
    it("responds with status code 201 and returns json data", done => {
      request(app)
        .post("/api/v1/articles")
        .set("authorization", userToken)
        .send(user.defaultArticle)
        .expect("Content-Type", /json/)
        .end((err, res) => {
          if (err) return done(err);
          const {
            body: {
              status,
              data: { message, articleId, createdOn, title }
            }
          } = res;
          expect(res.status).to.equal(201);
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
  describe("PATCH /articles/<articleid>", () => {
    let articleid;
    before(done => {
      db.one(
        // Insert default Article into table article
        "INSERT INTO article (title, article) VALUES ($1, $2) RETURNING articleid",
        [user.defaultArticle.title, user.defaultArticle.article]
      ).then(val => {
        articleid = val.articleid;
        done();
      });
    });
    it("responds with status code 201 and returns json data", done => {
      request(app)
        .patch(`/api/v1/articles/${articleid}`)
        .set("authorization", userToken)
        .send(user.editedArticle)
        .expect("Content-Type", /json/)
        .end((err, res) => {
          if (err) return done(err);
          const {
            body: {
              status,
              data: { message, title, article }
            }
          } = res;
          expect(res.status).to.equal(201);
          expect(status).to.equal("success");
          expect(message).to.be.equal("Article successfully updated");
          expect(title).to.be.a("string");
          expect(article).to.be.a("string");
          done();
        });
    });
  });
  // employees can delete their articles
  describe("DELETE /articles/<articleid>", () => {
    let articleid;
    before(done => {
      db.one(
        // Insert default Article into table article
        "INSERT INTO article (title, article) VALUES ($1, $2) RETURNING articleid",
        [user.defaultArticle.title, user.defaultArticle.article]
      ).then(val => {
        articleid = val.articleid;
        done();
      });
    });
    it("returns json data and responds with status code 200", done => {
      request(app)
        .delete(`/api/v1/articles/${articleid}`)
        .set("authorization", userToken)
        .expect("Content-Type", /json/)
        .end((err, res) => {
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
  // employees can delete their gif
  describe("DELETE /gifs/<gifid>", () => {
    let gifid;
    before(done => {
      db.none("TRUNCATE TABLE gif CASCADE");
      db.one(
        // Insert default Article into table article
        "INSERT INTO gif (title, image_url, date_created) VALUES ($1, $2, $3) RETURNING gifid",
        [user.testGif.title, user.testGif.image, user.testGif.date]
      ).then(val => {
        gifid = val.gifid;
        done();
      });
    });
    it("responds with status code 200 and returns json object", done => {
      request(app)
        .delete(`/api/v1/gifs/${gifid}`)
        .set("authorization", userToken)
        .expect("Content-Type", /json/)
        .end((err, res) => {
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
  // Employees can comment on other colleagues' article post
  describe("POST /articles/<articleid>/comment", () => {
    let articleid;
    before(done => {
      db.none("TRUNCATE TABLE comment");
      db.one(
        // Insert default Article into table article
        "INSERT INTO article (title, article, authorid) VALUES ($1, $2, $3) RETURNING articleid",
        [user.defaultArticle.title, user.defaultArticle.article, employeeid]
      ).then(val => {
        articleid = val.articleid;
        done();
      });
    });
    it("respond with status code 201 and returns json object containing comment", done => {
      request(app)
        .post(`/api/v1/articles/${articleid}/comment`)
        .set("authorization", userToken)
        .send(user.comment1)
        .expect("Content-Type", /json/)
        .end((err, res) => {
          if (err) return done(err);
          const {
            body: {
              status,
              data: { message, createdOn, articleTitle, article, comment }
            }
          } = res;
          expect(res.status).to.equal(201);
          expect(status).to.equal("success");
          expect(message).to.be.equal("Comment successfully created");
          expect(createdOn).to.be.a("string");
          expect(articleTitle).to.be.a("string");
          expect(article).to.be.a("string");
          expect(comment).to.be.a("string");
          done();
        });
    });
  });
  // Employees can comment on other colleagues' gif post
  describe("POST /gifs/<gifid>/comment", () => {
    let gifid;
    before(done => {
      db.none("TRUNCATE TABLE comment").then(() => {
        db.one(
          // Insert default Article into table article
          "INSERT INTO gif (title, image_url, authorid) VALUES ($1, $2, $3) RETURNING gifid",
          [user.testGif.title, user.testGif.image, employeeid]
        ).then(val => {
          gifid = val.gifid;
          done();
        });
      });
    });
    it("responds with status code 201 and returns json date with comment", done => {
      request(app)
        .post(`/api/v1/gifs/${gifid}/comment`)
        .set("authorization", userToken)
        .send(user.comment2)
        .expect("Content-Type", /json/)
        .end((err, res) => {
          if (err) return done(err);
          const {
            body: {
              status,
              data: { message, createdOn, gifTitle, comment }
            }
          } = res;
          expect(res.status).to.equal(201);
          expect(status).to.equal("success");
          expect(message).to.be.equal("Comment successfully created");
          expect(createdOn).to.be.a("string");
          expect(gifTitle).to.be.a("string");
          expect(comment).to.be.a("string");
          done();
        });
    });
  });
  // Employees should get all feed
  // Employees should view specific article
  // describe("GET /api/v1/articles/:id", () => {
  //   let articleid;
  //   before(done => {
  //     db.one(
  //       // Insert default Article into table article
  //       `SELECT DISTINCT title, date_created, authorid, articleid FROM feed WHERE (articleid=$1 AND type='article');`,
  //       [articleid]
  //     ).then(value => {
  //       articleid = value.articleid;
  //       done();
  //     });
  //   });
  //   it("Should be able to retrieve a specific article upon request", done => {
  //     request(app)
  //       .get(`/api/v1/articles/${articleid}`)
  //       .set("Content-Type", "application/json")
  //       .then(res => {
  //         const {
  //           body: {
  //             status,
  //             data: { value }
  //           }
  //         } = res;
  //         expect(res.status).to.equal(200);
  //         expect(status).to.equal("success");
  //         expect(value).to.be.a("string");
  //         expect(articleid).to.be.a("number");
  //         expect(articleid % 1).to.equal(0);
  //         done();
  //       })
  //       .catch(err => done(err));
  //   });
  // });
});
