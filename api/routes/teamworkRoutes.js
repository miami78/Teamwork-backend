const express = require("express");
const teamworkQuery = require("../controllers/queries");
const routeAuth = require("../auth/auth");

const router = express.Router();

// gets json response
router.get("/", (req, res) => {
  res.json({ message: "Server starts successfully!" });
});

// employees can post gifs
router.post("/gifs", routeAuth.auth, teamworkQuery.createGif);

// employees can post articles
router.post("/articles", routeAuth.auth, teamworkQuery.createArticle);

module.exports = router;
