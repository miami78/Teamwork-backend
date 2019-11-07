const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("./db");
// SQL query to create-user
const createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then(password => {
    const {
      firstName,
      lastName,
      email,
      gender,
      jobRole,
      department,
      address
    } = req.body;

    db.one({
      text:
        "INSERT INTO employee(firstname, lastname, email, password, gender, job_role, department, address) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING employeeid",
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
    })
      .then(value => {
        const userToken = jwt.sign(
          { userid: value.employeeid },
          "RANDOM_TOKEN_SECRET",
          {
            expiresIn: "24h"
          }
        );
        res.status(201).json({
          status: "success",
          data: {
            message: "User account successfully created",
            token: userToken,
            userId: value.employeeid
          }
        });
      })
      .catch(err => {
        res.status(500).json(next(err));
      });
  });
};

// SQL query to signin user
const signin = (req, res, next) => {
  const { email, password } = req.body;
  // Retrieve all values from database where email match
  db.one("SELECT  * FROM employee WHERE email = $(email)", { email })
    .then(value => {
      // compare received email address with database value
      if (value.email !== email) {
        return res.status(401).json({
          error: new Error("User not found")
        });
      }
      // Use bcrypt to compare hash of sent password with database password hash
      bcrypt
        .compare(password, value.password)
        .then(valid => {
          if (!valid) {
            return res.status(401).json({
              error: new Error("Incorrect password")
            });
          }
          const userToken = jwt.sign(
            { userid: value.employeeid },
            "RANDOM_TOKEN_SECRET",
            { expiresIn: "1h" }
          );
          res.status(200).json({
            status: "success",
            data: {
              token: userToken,
              userId: value.employeeid
            }
          });
        })
        .catch(err => {
          res.status(500).json(next(err));
        });
    })
    .catch(err => {
      res.status(500).json(next(err));
    });
};
module.exports = {
  createUser,
  signin
};
