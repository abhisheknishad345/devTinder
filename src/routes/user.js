
const express = require("express")
const userRouter = express.Router()

userRouter.get("/user/requests", (req, res)=>{
    // Get all the pending connection request for the loggedIn User

})

module.exports  = userRouter;