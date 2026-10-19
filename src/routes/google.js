
const express = require("express");
const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const User = require("../model/user");

const router = express.Router();

const googleClient = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID
);

router.post("/auth/google", async (req, res) => {
    try {
        const { credential } = req.body;

        if (!credential) {
            return res.status(400).json({
                message: "Google credential is required",
            });
        }

        // 1. Verify Google's ID token
        const ticket = await googleClient.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();

        if (!payload?.email || payload.email_verified !== true) {
            return res.status(401).json({
                message: "Google email is not verified",
            });
        }

        const {
            sub: googleId,
            email,
            given_name: firstName,
            family_name: lastName,
            picture: photoUrl,
        } = payload;

        const emailId = email.toLowerCase();

        // 2. Find an account already linked to this Google ID
        let user = await User.findOne({ googleId });

        if (!user) {
            // 3. Check whether this email already has an account
            const existingUser = await User.findOne({ emailId });

            if (existingUser) {
                // Existing manual account: do not link automatically
                if (!existingUser.googleId) {
                    return res.status(409).json({
                        code: "EMAIL_ALREADY_REGISTERED",
                        message:
                            "This email is already registered. Please log in using your email and password.",
                    });
                }

                // Same email, but linked to a different Google account
                return res.status(409).json({
                    code: "ACCOUNT_LINK_CONFLICT",
                    message:
                        "This email is already linked to another Google account.",
                });
            }

            // 4. Create a new Google account
            user = await User.create({
                googleId,
                emailId,
                Fname: firstName || "Google User",
                Lname: lastName || "Last",
                profileurl: photoUrl || "",
                emailVerified: true,
            });
        }

        // 5. Create your application's JWT
        const token = jwt.sign(
            { _id: user._id },
            process.env.SECRET_KEY,
            { expiresIn: "1d" }
        );

        // 6. Set the authentication cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite:
                process.env.NODE_ENV === "production"
                    ? "none"
                    : "lax",
            maxAge: 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({
            message: "Google authentication successful",
            user,
        });

    } catch (error) {
        console.error("Google authentication error:", error);

        // Handle simultaneous signup / duplicate-key attempts
        if (error.code === 11000) {
            return res.status(409).json({
                code: "ACCOUNT_ALREADY_EXISTS",
                message:
                    "An account with this email already exists. Please use your existing login method.",
            });
        }

        return res.status(401).json({
            message: "Google authentication failed",
        });
    }
});

module.exports = router;
