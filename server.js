require("dotenv").config();

const Datastore = require("nedb-promises");
const datastore = Datastore.create("./database/db.db");

const express = require("express");
const cors = require("cors");
const { logHandler, errorHandler, jwtHandler } = require("./middleware");
const cookieParser = require("cookie-parser");

const PORT = process.env.PORT || 3500;

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

app.use(logHandler);

app.use("/registration", require("./routes/registration"));
app.use("/authentication", require("./routes/authentication"));
app.use("/refresh", require("./routes/refresh"));
app.use("/logout", require("./routes/logout"));

app.use(jwtHandler);

app.all("*", (req, res) => {
  res.status(404).json({ message: "404, Not Found" });
});

app.use(errorHandler);

app.listen(PORT, () =>
  console.log(`Server is running successfully on http://localhost:${PORT}`)
);
