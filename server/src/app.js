const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const router = require("./routes");
const { errorResponserHandler } = require("./utils/errorHandler");

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(router);

app.use(errorResponserHandler);

app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

module.exports = app;
