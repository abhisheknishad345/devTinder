
const jwt = require("jsonwebtoken")
const User = require("../model/user")

/*
export  const adminAuth =  (req, res, next) =>{
    console.log("Admin auth is getting checked");
    const token = "xyz"
    const isAuthorised = token === "xyz"
    if (!isAuthorised) {
        res.status(401).send("Unauthorised admin request")
        
    } else {
        next()
    }
}

export  const userAuth =  (req, res, next) =>{
    console.log("User auth is getting checked");
    const token = "xyz"
    const isAuthorised = token === "xyz"
    if (!isAuthorised) {
        res.status(401).send("Unauthorised user request")
        
    } else {
        next()
    }
}

*/

const userAuth = async(req, res, next) => {

    // read the token from the req cookies
    try {
    const {token} = req.cookies;
    if (!token) {
        throw new Error("Token is not Valid!!!!")
    }

     // Validate  the token
     const decodedMessage = jwt.verify(token, "Dev@tinder$*55"); 
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
        res.status(400).send("Error: "+ err.message)
        
     }

}

module.exports = { userAuth }