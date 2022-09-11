require("dotenv").config();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fsPromises = require("fs").promises;
const path = require("path");

const usersDB = {
  users: require("../database/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};

const loginHandler = async (req, res) => {
  const { user, password } = req.body;

  if (!user || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Username and password are required." });
  }

  const foundUser = usersDB.users.find((person) => person.username === user);
  if (!foundUser) {
    return res.status(401).json({
      success: false,
      message: `User with username ${user} is does not exist.`,
    });
  }

  const matchPass = await bcrypt.compare(password, foundUser.password);

  if (matchPass) {
    const accessToken = jwt.sign(
      { username: foundUser.username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30s" }
    );
    const refreshToken = jwt.sign(
      { username: foundUser.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    const otherUsers = usersDB.users.filter(
      (person) => person.username !== foundUser.username
    );
    const currentUser = { ...foundUser, refreshToken };

    usersDB.setUsers([...otherUsers, currentUser]);

    await fsPromises.writeFile(
      path.join(__dirname, "..", "database", "users.json"),
      JSON.stringify(usersDB.users)
    );

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.status(200).json({
      success: true,
      message: `User ${user} is logged in.`,
      token: accessToken,
    });
  } else {
    res.status(401).json({
      success: false,
      message: `Wrong password, user ${user} is unauthorized.`,
    });
  }
};

module.exports = loginHandler;
