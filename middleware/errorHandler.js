const eventLogger = require("./eventLogger");

const errorHandler = (err, req, res, next) => {
  eventLogger(`${err.name}: ${err.message}`, "errorsLog.txt");
  console.error(err);
  res.status(500).send(err.message);
};

module.exports = errorHandler;
