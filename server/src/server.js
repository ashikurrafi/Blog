// Importing required modules
import app from "./app.js";
import connectDataBase from "./config/db.js";

const PORT = process.env.SERVER_PORT || 4000;

// Connect to the database and start the server once the connection is successful
connectDataBase()
  .then(() => {
    // Start the server and listen on the port defined in the environment variable or 4000
    app.listen(PORT, () => {
      console.log(`✅ Server is running at http://localhost:${PORT}`);
      console.log(`✅ Server is running at PORT:${PORT}`);
    });
  })
  .catch((error) => {
    // If the database connection fails, log the error and terminate the process
    console.error(`❌ MongoDB connection failed: ${error}`);
    // Exit the process with a failure status
    process.exit(1);
  });
