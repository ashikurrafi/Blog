// Importing required modules
const dotenv = require("dotenv");
const app = require("./app");
const connectDataBase = require("./config/db");

// Load environment variables from the .env file
dotenv.config();

// Connect to the database and start the server once the connection is successful
connectDataBase()
  .then(() => {
    // Start the server and listen on the port defined in the environment variable or 8080
    app.listen(process.env.SERVER_PORT || 8080, () => {
      console.log(
        `Server is running at http://localhost:${process.env.SERVER_PORT}`
      );
      console.log(`Server is running at PORT:${process.env.SERVER_PORT}`);
    });
  })
  .catch((error) => {
    // If the database connection fails, log the error and terminate the process
    console.error(`MongoDB connection failed: ${error}`);
    // Exit the process with a failure status
    process.exit(1);
  });
