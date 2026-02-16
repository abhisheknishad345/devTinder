
// import mongoose from 'mongoose';
const mongoose = require('mongoose');
const validator = require('validator')
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");


const userSchema = mongoose.Schema({
    Fname: {
        type: String,
        required: [true, "Name is required"],
        minLength: [3, "Name must be at least 3 characters"],
        maxLength: 30,
        trim: true,
    },
    Lname: {
        type: String,
        trim: true,
        maxLength: 15,
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        // trim: true,
        validate(value) {
           // validator: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
            if(!validator.isEmail(value)){
                throw new Error("Invalid email Format"+value)
            }
        }
    },
        password: {
            type: String,
            required: true,
            validate(value){
                if(!validator.isStrongPassword(value)){
                    throw new Error("Enter a strong password: " + value)
                }

            }
        },
        age: {
            type: Number,
            min: 18,
            max:120
        },
        gender: {
            type: String,
            enum:{
                values:["Male", "Female", "Others"],
                message:`{VALUE} is not a valid gender type`

            },

            // validate(value){
            //     if (!["Male", "Female", "Others"].includes(value)) {
            //         throw new Error("Gender data is invalid: "+value)
                    
            //     }
            // }
        },
        profileurl: {
            type: String,
            minLength: 10,
            validate(value){
                if(!validator.isURL(value)){
                    throw new Error("Invalid URL format: " + value)
                }

            }
        },
        about:{
            type: String,
            minLength:5,
            maxLength: 50,
            default: "This is default about user"
        },
        skills:{
            type: [String],
            // maxLength:10
            
        },
       
    },

    {
        timestamps: true
    }
);

userSchema.index({Fname:1, Lname:1})

// get token for any user 
userSchema.methods.getJWT = function(){
    const user = this;
    const token =  jwt.sign({_id: user._id}, "Dev@tinder$*55", {expiresIn: "10m"});
    return token;
}

// validate password for any user
userSchema.methods.validatePassword = async function(passwordInputByUser){
    const user = this;
    const passwordHash = user.password;

    const isValidPassword = await bcrypt.compare(passwordInputByUser, passwordHash);
    return isValidPassword;
}

const UserModel = mongoose.model("User", userSchema)
module.exports = UserModel;