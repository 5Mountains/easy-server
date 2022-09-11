require("dotenv").config();

const jwt = require("jsonwebtoken");

const jwtHandler = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized.",
    });
  }

  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: "Forbidden.",
      });
    }
    req.user = decoded.username;
    next();
  });
};

module.exports = jwtHandler;
