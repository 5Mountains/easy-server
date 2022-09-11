const express = require("express");

const router = express.Router();
const { loginHandler } = require("../controllers");

router.post("/", loginHandler);

module.exports = router;
