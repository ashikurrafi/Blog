const mongoose = require("mongoose"); // Importing mongoose to interact with MongoDB

// Function to connect to the MongoDB database
const connectDataBase = async () => {
  try {
    // Connecting to MongoDB using connection string from environment variables
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URL}/${process.env.DATABASE_NAME}`
    );
    console.log("Connected to MongoDB successfully!"); // Log success message
    console.log(`Database host: ${connectionInstance.connection.host}`); // Log the host of the database
  } catch (error) {
    // If there's an error, log it and exit the process
    console.error(`MongoDB connection failed: ${error.message}`);
    process.exit(1); // Exit the process with a failure status
  }
};

// Exporting the connectDataBase function so it can be used elsewhere
module.exports = connectDataBase;
