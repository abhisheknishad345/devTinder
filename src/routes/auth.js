
const express = require('express')
const authRouter = express.Router()
const { validateSinupData, validatePassword } = require('../utils/validation')
const bcrypt = require("bcrypt");
const User = require("../model/user")
const EmailVerification = require("../model/emailVerification");
const PasswordReset = require("../model/passwordReset");
const ConnectionRequestModel = require('../model/connectionRequest')
const { userAuth } = require('../middleWares/auth');
const {
  generalLimiter, loginLimiter, signupLimiter, 
  otpLimiter, resendOtpLimiter,
} = require("../middleWares/rateLimiter");
const crypto = require("crypto");
const { sendOTPEmail, passwordResetOTPEmail } = require("../services/email.service");

// authRouter.get('/')

authRouter.post("/signup", signupLimiter, async (req, res) => {

    try {

        // 1. Validate signup data
        validateSinupData(req);

        const {
            Fname,
            Lname,
            password,
            emailId,
            age,
            gender,
            about,
            profileurl,
            skills
        } = req.body;


        // 2. Normalize email
        const normalizedEmail = emailId.toLowerCase().trim();


        // 3. Check existing user
        const existingUser = await User.findOne({
            emailId: normalizedEmail
        });

        if (existingUser) {

            return res.status(400).json({
                message: "An account with this email already exists."
            });

        }


        // 4. Hash password
        const passwordHash = await bcrypt.hash(password, 10);


        // 5. Create user
        const userObj = new User({

            Fname,
            Lname,
            emailId: normalizedEmail,
            password: passwordHash,
            about,
            age,
            gender,
            profileurl,
            skills

        });


        const savedUser = await userObj.save();


        // 6. Generate 6 digit OTP
        const otp = crypto
            .randomInt(100000, 1000000)
            .toString();


        // 7. Hash OTP
        const otpHash = await bcrypt.hash(otp, 10);


        // 8. OTP expiry - 10 minutes
        const expiresAt = new Date(
            Date.now() + 10 * 60 * 1000
        );


        // 9. Save OTP
        await EmailVerification.create({

            userId: savedUser._id,
            otpHash,
            expiresAt,
            attempts: 0

        });


        // 10. Send OTP email
        await sendOTPEmail(
            normalizedEmail,
            otp
        );


        // 11. Response
        res.status(201).json({

            message: "Signup successful. Please verify your email.",

            data: {
                userId: savedUser._id,
                emailId: savedUser.emailId
            }

        });

    }

    catch (err) {

        console.error("Signup Error:", err);

        return res.status(400).json({

            error: err.message

        });

    }

});

// email verify
authRouter.post("/verify-email", otpLimiter, async (req, res) => {

    try {

        const { emailId, otp } = req.body;

        if (!emailId || !otp) {
            return res.status(400).json({
                message: "Email and OTP are required"
            });
        }

        const normalizedEmail = emailId.toLowerCase().trim();

        // 1. Find user
        const user = await User.findOne({
            emailId: normalizedEmail
        });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // 2. Already verified?
        if (user.emailVerified) {
            return res.status(400).json({
                message: "Email is already verified"
            });
        }

        // 3. Find OTP record
        const verification = await EmailVerification.findOne({
            userId: user._id
        });

        if (!verification) {
            return res.status(400).json({
                message: "OTP not found or expired"
            });
        }

        // 4. Check expiry
        if (verification.expiresAt < new Date()) {

            await EmailVerification.deleteOne({
                _id: verification._id
            });

            return res.status(400).json({
                message: "OTP has expired. Please request a new OTP."
            });
        }

        // 5. Check attempts
        if (verification.attempts >= 5) {

            await EmailVerification.deleteOne({
                _id: verification._id
            });

            return res.status(429).json({
                message: "Too many incorrect attempts. Please request a new OTP."
            });
        }

        // 6. Compare OTP
        const isOTPValid = await bcrypt.compare(
            otp,
            verification.otpHash
        );

        if (!isOTPValid) {

            verification.attempts += 1;
            await verification.save();

            return res.status(400).json({
                message: "Invalid OTP",
                attemptsRemaining: 5 - verification.attempts
            });
        }

        // 7. Mark email verified
        user.emailVerified = true;
        await user.save();

        // 8. Delete OTP
        await EmailVerification.deleteOne({
            _id: verification._id
        });

        // 9. Generate JWT
        const token = user.getJWT();

        // 10. Set cookie
        res.cookie("token", token, {
            expires: new Date(Date.now() + 48 * 3600000),
            httpOnly: true,
            secure: true,
            sameSite: "none"
        });

        return res.status(200).json({
            message: "Email verified successfully",
            data: {
                _id: user._id,
                Fname: user.Fname,
                Lname: user.Lname,
                emailId: user.emailId
            }
        });

    } catch (err) {

        console.error("Verify Email Error:", err);

        return res.status(400).json({
            message: err.message
        });
    }
});

// resend otp
authRouter.post("/resend-otp", resendOtpLimiter, async (req, res) => {

    try {

        const { emailId } = req.body;

        // 1. Check email
        if (!emailId) {
            return res.status(400).json({
                message: "Email is required"
            });
        }

        // 2. Normalize email
        const normalizedEmail = emailId.toLowerCase().trim();

        // 3. Find user
        const user = await User.findOne({
            emailId: normalizedEmail
        });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // 4. Check if already verified
        if (user.emailVerified) {
            return res.status(400).json({
                message: "Email is already verified"
            });
        }

        // 5. Find existing OTP
        const existingVerification =
            await EmailVerification.findOne({
                userId: user._id
            });

        // 6. 120-second cooldown
        if (
            existingVerification &&
            existingVerification.createdAt &&
            Date.now() -
            existingVerification.createdAt.getTime() < 120 * 1000
        ) {

            return res.status(429).json({
                message: "Please wait 120 seconds before requesting a new OTP"
            });

        }

        // 7. Generate new OTP
        const otp = crypto
            .randomInt(100000, 1000000)
            .toString();

        // 8. Hash OTP
        const otpHash = await bcrypt.hash(otp, 10);

        // 9. New expiry - 10 minutes
        const expiresAt = new Date(
            Date.now() + 10 * 60 * 1000
        );

        // 10. Update existing OTP
        await EmailVerification.findOneAndUpdate(
            {
                userId: user._id
            },
            {
                otpHash,
                expiresAt,
                attempts: 0
            },
            {
                upsert: true
            }
        );

        // 11. Send OTP
        await sendOTPEmail(
            normalizedEmail,
            otp
        );

        // 12. Response
        return res.status(200).json({
            message: "New OTP sent to your email"
        });

    } catch (err) {

        console.error("Resend OTP Error:", err);

        return res.status(400).json({
            message: err.message
        });
    }
});



// Login API
authRouter.post("/login", loginLimiter, async (req, res) => {

    try {
        const { emailId, password } = req.body;

        const user = await User.findOne({
            emailId: emailId.toLowerCase().trim()
        });

        if (!user) {
            throw new Error("Invalid Credentials");
        }

        // Email verification check
        if (!user.emailVerified) {
            return res.status(403).json({
                message: "Please verify your email first"
            });
        }

        if (!user) {
            throw new Error("Invalid Credentials")

        }
        const isValidPassword = await user.validatePassword(password);
        if (!isValidPassword) {
            throw new Error("Invalid Credentials");
        }


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
        res.status(401).send("Login Error: " + err.message)


    }

});

// forgot-password
authRouter.post("/forgot-password", resendOtpLimiter, async (req, res) => {

    try {

        const { emailId } = req.body;

        // 1. Validate email
        if (!emailId) {
            return res.status(400).json({
                message: "Email is required"
            });
        }

        // 2. Normalize email
        const normalizedEmail = emailId.toLowerCase().trim();

        // 3. Find user
        const user = await User.findOne({
            emailId: normalizedEmail
        });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // 4. Email must be verified
        if (!user.emailVerified) {
            return res.status(403).json({
                message: "Please verify your email first"
            });
        }

        // 5. Find existing reset OTP
        const existingReset =
            await PasswordReset.findOne({
                userId: user._id
            });

        // 6. 120-second cooldown
        if (
            existingReset &&
            existingReset.updatedAt &&
            Date.now() -
            existingReset.updatedAt.getTime() < 120 * 1000
        ) {

            return res.status(429).json({
                message: "Please wait 120 seconds before requesting a new OTP"
            });
        }

        // 7. Generate OTP
        const otp = crypto
            .randomInt(100000, 1000000)
            .toString();

        // 8. Hash OTP
        const otpHash = await bcrypt.hash(otp, 10);

        // 9. Expiry - 10 minutes
        const expiresAt = new Date(
            Date.now() + 10 * 60 * 1000
        );

        // 10. Save reset OTP
        await PasswordReset.findOneAndUpdate(
            {
                userId: user._id
            },
            {
                otpHash,
                expiresAt,
                attempts: 0
            },
            {
                upsert: true
            }
        );

        // 11. Send OTP email
        await passwordResetOTPEmail(
            normalizedEmail,
            otp
        );

        // 12. Response
        return res.status(200).json({
            message: "Password reset OTP sent to your email"
        });

    } catch (err) {

        console.error("Forgot Password Error:", err);

        return res.status(400).json({
            message: err.message
        });
    }
});

// reset password
authRouter.post("/reset-password", otpLimiter, async (req, res) => {
    try {
         validatePassword(req)
        const { emailId, otp, newPassword } = req.body;

        // 1. Check input
        if (!emailId || !otp || !newPassword) {
            return res.status(400).json({
                message: "Email, OTP and new password are required"
            });
        }

        // 2. Normalize email
        const normalizedEmail = emailId.toLowerCase().trim();

        // 3. Find user
        const user = await User.findOne({
            emailId: normalizedEmail
        });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // 4. Find password reset record
        const resetRecord = await PasswordReset.findOne({
            userId: user._id
        });

        if (!resetRecord) {
            return res.status(400).json({
                message: "Invalid or expired OTP"
            });
        }

        // 5. Check expiry
        if (resetRecord.expiresAt < new Date()) {
            await PasswordReset.deleteOne({
                _id: resetRecord._id
            });

            return res.status(400).json({
                message: "OTP has expired"
            });
        }

        // 6. Check attempts
        if (resetRecord.attempts >= 5) {
            return res.status(429).json({
                message: "Too many incorrect OTP attempts"
            });
        }

        // 7. Compare OTP
        const isValidOTP = await bcrypt.compare(
            otp,
            resetRecord.otpHash
        );

        if (!isValidOTP) {
            resetRecord.attempts += 1;
            await resetRecord.save();

            return res.status(400).json({
                message: "Invalid OTP",
                attemptsRemaining: 5 - resetRecord.attempts
            });
        }

        // 8. Hash new password
        const hashedPassword = await bcrypt.hash(
            newPassword,
            10
        );

        // 9. Update password
        user.password = hashedPassword;
        await user.save();

        // 10. Delete reset OTP
        await PasswordReset.deleteOne({
            _id: resetRecord._id
        });

        return res.status(200).json({
            message: "Password reset successfully"
        });

    } catch (err) {
        console.error("Reset Password Error:", err);

        return res.status(500).json({
            message: "Internal server error"
        });
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
    const { password } = req.body;
    try {
        const loggedInUser = req.user;
        const isCorrectPassword = await loggedInUser.validatePassword(password);


        if (!isCorrectPassword) {
            return res.status(401).json({
                message: "Password is incorrect"
            });
        }

        // 1. Database se user delete 
        await Promise.all([

            User.findByIdAndDelete(loggedInUser._id),

            ConnectionRequestModel.deleteMany({
                $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
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