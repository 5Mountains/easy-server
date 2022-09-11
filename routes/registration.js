const express = require("express");

const router = express.Router();
const { newUserHandler } = require("../controllers");

router.post("/", newUserHandler);

module.exports = router;
