
const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
    try {
        // console.log("DB String:",process.env.DB_URL)
        await mongoose.connect(process.env.DB_URL);
    } catch (err) {
        console.error("Database Connection Failed...");
        console.error(err.message);
        process.exit(1)
    }
};

module.exports = connectDB;
