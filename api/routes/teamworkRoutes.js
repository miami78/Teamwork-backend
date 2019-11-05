const express = require("express");

const router = express.Router();

// gets json response
router.get("/", (req, res) => {
  res.json({ message: "Server starts successfully!" });
});

module.exports = router;
