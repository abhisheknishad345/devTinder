const express = require("express");
const connectDB = require("./config/database")
const User = require("./model/user")

const app = express()
const port = 5700;


connectDB().then(() => {
    console.log("Database is connected...");

}).catch((err) => {
    console.error("Database is not Connected...");
})



app.listen(port, () => {
    console.log("Server is succesfully listening.. at port", port);


});