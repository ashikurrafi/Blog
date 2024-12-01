import dotenv from "dotenv";
import app from "./app.js";
import connectDataBase from "./config/db.js";

dotenv.config({ path: "./.env" });

connectDataBase()
  .then(
    app.listen(process.env.SERVER_PORT, () => {
      console.log(
        `info`,
        `Server is running ar http://localhost:${process.env.SERVER_PORT}`
      );
    })
  )
  .catch((error) => {
    console.log(`MongoDB connection failed !!! , ${error}`);
  });
