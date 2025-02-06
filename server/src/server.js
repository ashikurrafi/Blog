const dotenv = require("dotenv");
const app = require("./app");
const connectDataBase = require("./config/db");

dotenv.config();

connectDataBase()
  .then(() => {
    app.listen(process.env.SERVER_PORT || 8080, () => {
      console.log(
        `Server is running at http://localhost:${process.env.SERVER_PORT}`
      );
      console.log(`Server is running at PORT:${process.env.SERVER_PORT}`);
    });
  })
  .catch((error) => {
    console.error(`MongoDB connection failed: ${error}`);
    process.exit(1);
  });
