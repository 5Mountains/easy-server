const eventLogger = require("./eventLogger");

const logHandler = (req, res, next) => {
  eventLogger(
    `${req.method}\t${req.headers.origin}\t${req.url}`,
    "requestsLog.txt"
  );
  next();
};

module.exports = logHandler;
