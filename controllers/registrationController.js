const fsPromises = require("fs").promises;
const path = require("path");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

const usersDB = {
  users: require("../model/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};

const newUserHandler = async (req, res) => {
  const { user, password } = req.body;

  if (!user || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Username and password are required." });
  }

  const duplicate = usersDB.users.find((person) => (person.username = user));
  if (duplicate) {
    return res.status(400).json({
      success: false,
      message: `User with username ${user} is already exist.`,
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = uuidv4();
    const newUser = {
      _id: userId,
      username: user,
      password: hashedPassword,
    };

    usersDB.setUsers([...usersDB.users, newUser]);

    await fsPromises.writeFile(
      path.join(__dirname, "..", "model", "users.json"),
      JSON.stringify(usersDB.users)
    );

    res.status(201).json({
      success: true,
      message: `New user ${user} has been successfully created`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = newUserHandler;
