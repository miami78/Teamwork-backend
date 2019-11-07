const express = require("express");

const router = express.Router();
const teamworkQuery = require("../controllers/queries");

// admin can create an employee user account
router.post("/create-user", teamworkQuery.createUser);

// User can signin
router.post("/signin", teamworkQuery.signin);

module.exports = router;
