const express = require("express");
const connectDB = require("./config/database")
const User = require("./model/user")
//const {validateSinupData} = require('./utils/validation')
const bcrypt = require("bcrypt");
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken');
const bodyParser = require("body-parser");
//const {userAuth} = require('./middleWares/auth')

const app = express()
const port = 5700;

app.use(bodyParser.json());
app.use(express.json())
app.use(cookieParser())

// start from scratch

// SendConnectionReq API



connectDB().then(() => {
    console.log("Database is connected...");

}).catch((err) => {
    console.error("Database is not Connected...");
})



app.listen(port, () => {
    console.log("Server is succesfully listening.. at port", port);


});