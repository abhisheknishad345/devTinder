
// import mongoose from 'mongoose';
const mongoose = require('mongoose');
const { Schema } = mongoose;


const userSchema = mongoose.Schema({
    Fname: {
        type: String,
        required: [true, "Name is required"],
        minLength: [3, "Name must be at least 3 characters"],
        maxLength: 25,
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
        validate: {
            validator: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
            message: "Invalid email format",
        }
    },
        password: {
            type: String,
            required: true
        },
        age: {
            type: Number,
            min: 18
        },
        gender: {
            type: String,
            validate(value){
                if (!["Male", "Female", "Others"].includes(value)) {
                    throw new Error("Gender data is invalid")
                    
                }
            }
        },
        profileurl: {
            type: String,
            minLength: 10,
            validate: {
            validator: function (v) {
                return /^(http|https):\/\/[^ "]+$/.test(v);
            },
            message: "Invalid URL format",
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
            
        },
       
    },
    {
        timestamps: true
    }
)

const UserModel = mongoose.model("User", userSchema)
module.exports = UserModel;