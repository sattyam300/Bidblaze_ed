// Import the mongoose library, which is an Object Data Modeling (ODM) library for MongoDB and Node.js.
const mongoose = require('mongoose');

// This function establishes a connection to the MongoDB database.
const connectDB = async () => {
  try {
    // Attempt to connect to the database using the connection string from the environment variables.
    // The MONGO_URI variable should be set in your .env file.
    const conn = await mongoose.connect(process.env.MONGO_URI);

    // If the connection is successful, log a confirmation message to the console.
    // `conn.connection.host` will display the host of the connected database.
    console.log(`MongoDB Connected Connected Successfully`);
  } catch (error) {
    // If an error occurs during the connection attempt, log the error message.
    console.error(`Error: ${error.message}`);
    
    // Exit the Node.js process with a "failure" code (1). This is important because
    // if the app can't connect to the database, it can't function properly.
    process.exit(1);
  }
};

// Export the connectDB function so it can be imported and used in other files (like server.js).
module.exports = connectDB;
