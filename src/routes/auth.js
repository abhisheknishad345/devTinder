
const express = require('express')
const authRouter = express.Router()
const { validateSinupData } = require('../utils/validation')
const bcrypt = require("bcrypt");
const User = require("../model/user")
const ConnectionRequestModel = require('../model/connectionRequest')
const jwt = require('jsonwebtoken');
const { userAuth } = require('../middleWares/auth');

// authRouter.get('/')

authRouter.post("/signup", async (req, res) => {
    //  console.log("🔥 Signup route hit");
    // Validation of data
    validateSinupData(req)
    const { Fname, Lname, password, emailId, age, gender, about, profileurl, skills } = req.body;
    // Encrypt the password
    const passwordHash = await bcrypt.hash(password, 10)
    // console.log("Hash Format: " +passwordHash);
    // Store the data in DB

    // console.log(req.body); // give "undefined", to avoid it use 'Express.json' which convert the json data in JS Object format and U will need a middleware


    try {
        const userObj = new User({
            Fname,
            Lname,
            emailId,
            password: passwordHash,
            about,
            age,
            gender,
            profileurl,
            skills
        });

        const existingUser = await User.findOne({ emailId });
        if (existingUser) {
            return res.status(400).json({
                message: 'An account with this email already exists.'
            });
        }

        const savedUser = await userObj.save();
        const token = savedUser.getJWT();

        // console.log("Token:", token);

        /// Add token to the cookie and send the response back to user
        res.cookie("token", token,

            {
                expires: new Date(Date.now() + 24 * 3600000),
                httpOnly: true,
                secure: true,      // Essential for cross-site (HTTPS)
                sameSite: "none"
            }
        )

        res.json({ message: "User Added succesfully", data: savedUser })
    } catch (err) {

        return res.status(400).json({ error: err.message });

    }
    // console.log("Signup hit at End !!");

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

                {
                    expires: new Date(Date.now() + 48 * 3600000),
                    httpOnly: true,
                    secure: true,      // Essential for cross-site (HTTPS)
                    sameSite: "none"

                }
            )

            res.json({
                message: "Login Successfull !!",
                data: user
            });
            // console.log(object);

        } else {
            throw new Error("Invalid Credentials")



        }

    } catch (err) {
        res.status(404).send("Login Error: " + err.message)


    }

});

// Logout API
authRouter.post("/logout", userAuth, async (req, res) => {

    try {
        res.cookie("token", null, {
            expires: new Date(Date.now()),
            httpOnly: true,
            secure: true,
            sameSite: "none",
        })
        res.status(200).json({ message: "Logout successful!" });

    } catch (err) {
        res.status(400).send("Logout error, " + err)
    }


})


authRouter.delete("/user/delete", userAuth, async (req, res) => {

    const { toUserId, fromUserId } = req.params
    try {
        const loggedInUser = req.user;

        // 1. Database se user delete 
      await Promise.all([
        User.findByIdAndDelete(loggedInUser._id),

        ConnectionRequestModel.deleteMany({
            $or: [{ fromUserId: loggedInUser }, { toUserId: loggedInUser }],
        })

        ])


// 2. Cookie / Token clear
res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
    secure: true,
    sameSite: "none",
});


res.status(200).json({ message: "Account deleted successful!" });
    } catch (err) {
    res.status(400).json({ message: "ERROR: " + err.message });
}
});



module.exports = authRouter;