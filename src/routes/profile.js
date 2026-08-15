
const express = require('express')
const profileRouter = express.Router()
const {userAuth} = require('../middleWares/auth')
const {validateEditProfile} = require('../utils/validation')

profileRouter.get("/profile/view", userAuth, async (req, res) =>{

    try {
    const user = req.user;
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.send(user);
    // res.send("Reading Cookie"); // cookie is send back after user Login

    } catch (err) {
        res.status(401).send("Some error occured: " + err.message);
    }

     

})

// prfileUpdate API
profileRouter.put("/profile/update", userAuth, async (req, res) => {
    //  res.send("PATCH is working");

    // console.log("Patch Hit");
    try {
        if (!validateEditProfile(req)) {
            throw new Error("Invalid edit request")
        }

        const loggedInUser = req.user;
        // console.log(loggedInUser)
        Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]))
      await loggedInUser.save();
        // console.log(loggedInUser)
        res.json({
            
            message: `${loggedInUser.Fname}, Your profile updation successful!`,
            data: loggedInUser,
        }
    )
    // console.log("Patch Hit");


    } catch (err) {

        res.status(400).send(err.message)


    }

})


module.exports = profileRouter;