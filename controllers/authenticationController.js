const bcrypt = require("bcrypt");

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
    res.status(200).json({
      success: true,
      message: `User ${user} is logged in.`,
    });
  } else {
    res.status(401).json({
      success: false,
      message: `Wrong password, user ${user} is unauthorized.`,
    });
  }
};

module.exports = loginHandler;
