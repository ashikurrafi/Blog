import dotenv from "dotenv";
import connectDataBase from "./config/db.js";
import app from "../src/app.js";

dotenv.config({ path: "./.env" });

connectDataBase()
  .then(
    app.listen(process.env.SERVER_PORT, () => {
      console.log(
        "info",
        `Server is running ar http://localhost:${process.env.SERVER_PORT}`
      );
    })
  )
  .catch((err) => {
    console.log("MongoDB connection failed !!! ", err);
  });
