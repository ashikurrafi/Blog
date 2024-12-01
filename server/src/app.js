import cors from "cors";
import express from "express";
import morgan from "morgan";

import authRoute from "./routes/authRoute.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/test", (req, res) => {
  res.send("Test API is working [GET] <br/> Hello, World!");
});
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.use("/", authRoute);

export default app;
