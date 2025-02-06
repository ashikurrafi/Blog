const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const router = require("./routes");

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(cors());

app.use(router);

app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

module.exports = app;
