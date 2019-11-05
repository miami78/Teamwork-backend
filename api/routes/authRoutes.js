const express = require("express");

const router = express.Router();
const query = require("../controllers/queries");

// admin can create an employee user account
router.post("/create-user", query.createUser);

module.exports = router;
