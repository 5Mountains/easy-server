require("dotenv").config();

const jwt = require("jsonwebtoken");

const usersDB = {
  users: require("../database/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};

const refreshTokenHandler = (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) {
    return res.status(401).json({ success: false, message: "Unauthorized." });
  }

  const refreshToken = cookies.jwt;
  const foundUser = usersDB.users.find(
    (person) => person.refreshToken === refreshToken
  );
  if (!foundUser) {
    return res.status(403).json({
      success: false,
      message: `Forbidden.`,
    });
  }

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || foundUser.username !== decoded.username) {
      return res.status(403).json({
        success: false,
        message: `Forbidden.`,
      });
    }
    const accessToken = jwt.sign(
      { username: decoded.username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30s" }
    );
    res.status(200).json({ success: true, accessToken });
  });
};

module.exports = refreshTokenHandler;
