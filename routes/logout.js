const express = require("express");

const router = express.Router();
const { logoutHandler } = require("../controllers");

router.get("/", logoutHandler);

module.exports = router;
