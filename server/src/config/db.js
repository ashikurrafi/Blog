const mongoose = require("mongoose");

const connectDataBase = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URL}/${process.env.DATABASE_NAME}`
    );
    console.log("Connected to MongoDB successfully!");
    console.log(`Database host: ${connectionInstance.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection failed: ${error.message}`);
    process.exit(1); // Exit the process on failure
  }
};

module.exports = connectDataBase;
