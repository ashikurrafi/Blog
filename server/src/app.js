import express from "express";
import morgan from "morgan";
import cors from "cors";

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

export default app;
