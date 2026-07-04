
// THIS  IS HOMEWORK 
const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    firstName: {
        type: String
    },
    lastName: {
        type: strinf

    },
    age:{
        type: Number
    },
    gender: {
        type: String
    },
    password: {
        type: String
    },
    emailId :{ type: String}
})

const User = mongoose("User", userSchema); // "User" model is created 

module.exports = User