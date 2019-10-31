const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use(bodyParser.json());

// gets json response
app.get("/", (req, res) => {
  res.json({ message: "Server starts successfully!" });
});
// admin can create an employee user account
app.post("/auth/create-user", (req, res, next) => {
  res.status(201).json({
    status: "success",
    data: {
      message: "User account successfully created!",
      token: "",
      userId: 4
    }
  });
});
module.exports = app;
