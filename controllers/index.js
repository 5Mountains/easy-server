const newUserHandler = require("./registrationController");
const loginHandler = require("./authenticationController");
const refreshTokenHandler = require("./refreshTokenController");
const logoutHandler = require("./logoutController");

module.exports = {
  newUserHandler,
  loginHandler,
  refreshTokenHandler,
  logoutHandler,
};
