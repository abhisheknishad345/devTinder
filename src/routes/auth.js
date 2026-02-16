
const express = require('express')
const authRouter = express.Router()
const { validateSinupData } = require('../utils/validation')
const bcrypt = require("bcrypt");
const User = require("../model/user")
const jwt = require('jsonwebtoken');
const { userAuth } = require('../middleWares/auth');

// authRouter.get('/')

authRouter.post("/signup", async (req, res) => {
    // Validation of data
    validateSinupData(req)
    const { Fname, Lname, password, emailId, age,gender,profileurl,skills } = req.body;
    // Encrypt the password
    const passwordHash = await bcrypt.hash(password, 10)
    // console.log("Hash Format: " +passwordHash);
    // Store the data in DB

    // console.log(req.body); // give "undefined", to avoid it use 'Express.json' which convert the json data in JS Object format and U will need a middleware


    //     // Creating a new instance of User Model

    //         Fname: "JJ",
    //         Lname: "Thomson",
    //         emailId: "jjt533@gmail.com",
    //         password: "thomson@165",
    //         age: 21,

    try {
        const userObj = new User({
            Fname,
            Lname,
            emailId,
            password: passwordHash,
            // password,
            age,
            gender,
            profileurl,
            skills
        });


        await userObj.save();
        res.send("User Added succesfully")
    } catch (err) {
        res.status(404).send("ERROR: " + err)

    }

})

// Login API
authRouter.post("/login", async (req, res) => {

    try {


        const { emailId, password } = req.body;
        const user = await User.findOne({ emailId: emailId });
        if (!user) {
            throw new Error("Invalid Credentials")

        }
        const isValidPassword = await user.validatePassword(password);

        if (isValidPassword) {
            // if (password == user.password) {

            // Create a JWT Token(
            const token = user.getJWT();

            // console.log("Token:", token);

            /// Add token to the cookie and send the response back to user
            res.cookie("token", token,
                //  { expires: new Date(Date.now() + 30 * 60*60 * 1000) }
                {
                    maxAge: 72 * 60 * 60 * 1000, // 30 hours
                    secure: true
                }
            )

            res.send("Login Succesfull !!");
            // console.log(object);

        } else {
            throw new Error("Invalid Credentials")

            // 6307478432

        }

    } catch (err) {
        res.status(404).send("Login ERROR: " + err.message)


    }

});

// Logout API
authRouter.post("/logout", userAuth, async (req, res) => {

    try {
        res.cookie("token", null, { expires: new Date(Date.now()) })
        res.send("Logged out Succesfully")

    } catch (err) {
        res.status(400).send("Logout error, " + err)
    }


})



module.exports = authRouter;