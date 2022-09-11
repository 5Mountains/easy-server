const fsPromises = require("fs").promises;
const path = require("path");

const usersDB = {
  users: require("../database/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};

const logoutHandler = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) {
    return res.sendStatus(204);
  }

  const refreshToken = cookies.jwt;
  const foundUser = usersDB.users.find(
    (person) => person.refreshToken === refreshToken
  );

  if (!foundUser) {
    res.clearCookie("jwt", { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
    return res.sendStatus(204);
  }

  const otherUsers = usersDB.users.filter(
    (person) => person.refreshToken !== foundUser.refreshToken
  );
  const currentUser = { ...foundUser, refreshToken: "" };

  usersDB.setUsers([...otherUsers, currentUser]);
  await fsPromises.writeFile(
    path.join(__dirname, "..", "database", "users.json"),
    JSON.stringify(usersDB.users)
  );

  res.clearCookie("jwt", { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
  return res.sendStatus(204);
};

module.exports = logoutHandler;
