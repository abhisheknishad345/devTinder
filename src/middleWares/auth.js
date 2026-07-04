
const jwt = require("jsonwebtoken")
const User = require("../model/user")

const userAuth = async (req, res, next) => {
    // OPTIONS request ko bypass karo
    if (req.method === "OPTIONS") {
        return next();
    }

    // read the token from the req cookies
    try {
        const { token } = req.cookies;
        // console.log("Cookies:", req.cookies);
        if (!token) {
            return res.status(401).send("Please Login!!")

        }

        // Validate  the token
        const decodedMessage = jwt.verify(token, process.env.SECRET_KEY);
        //  console.log(decodedMessage); 
        const { _id } = decodedMessage;
        //   console.log("Logged in user ID:", _id);
        // Find the user
        const user = await User.findById(_id)
        if (!user) {
            throw new Error("User not Found")

        }
        req.user = user;

        next();



    } catch (err) {
        res.status(400).send("Error: " + err.message)

    }

}

module.exports = { userAuth }