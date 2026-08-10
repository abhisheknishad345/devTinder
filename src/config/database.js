
const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
    try {
        // console.log("DB String:",process.env.DB_SECRET_KEY)
        await mongoose.connect(process.env.DB_SECRET_KEY);
    } catch (err) {
        console.error("Database Connection Failed...");
        console.error(err.message);
    }
};

module.exports = connectDB;
