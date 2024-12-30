const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URL2);
    console.log("Connected to the DB");
  } catch (error) {
    console.log(
      "Some error occured while trying to connect to the database.",
      error
    );
  }
};

module.exports = connectDB;
