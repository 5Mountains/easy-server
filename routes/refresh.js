const express = require("express");

const router = express.Router();
const { refreshTokenHandler } = require("../controllers");

router.get("/", refreshTokenHandler);

module.exports = router;
