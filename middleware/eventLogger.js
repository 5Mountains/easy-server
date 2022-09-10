const { format } = require("date-fns");
const { v4: uuidv4 } = require("uuid");

const fsPromises = require("fs").promises;
const path = require("path");

const eventLogger = async (message, logName) => {
  const dateTime = `${format(new Date(), "yyyy-MM-dd\tHH:mm:ss")}`;
  const logItem = `${dateTime}\t${uuidv4()}\t${message}\n`;

  try {
    await fsPromises.appendFile(
      path.join(__dirname, "..", "logs", logName),
      logItem
    );
  } catch (err) {
    console.error(err);
  }
};

module.exports = eventLogger;
