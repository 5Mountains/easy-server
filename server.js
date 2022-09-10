require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { logHandler } = require("./middleware");

const app = express();

const PORT = process.env.PORT || 3500;

app.use(cors());
app.use(express.json());

app.use(logHandler);

app.listen(PORT, () =>
  console.log(`Server is running successfully on http://localhost:${PORT}`)
);
