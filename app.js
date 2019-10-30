const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const knex = require("knex");

const db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    user: "postgres",
    password: "50filthyCENT!",
    database: "teamwork-dev"
  }
});

const app = express();

app.use(cors());
app.use(bodyParser.json());

module.exports = app;
