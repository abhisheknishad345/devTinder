
// import mongoose from 'mongoose';
const mongoose = require('mongoose') ;

const userSchema = mongoose.Schema({
    Fname: {
        type: String
    },
    Lname : {
        type: String
    },
    emailId: {
        type: String
    },
    password: {
        type: String
    },
    age: {
        type: Number
    },
    gender: {
        type: String
    }
})

const UserModel = mongoose.model("User", userSchema)
module.exports = UserModel;