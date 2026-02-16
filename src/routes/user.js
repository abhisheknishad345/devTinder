
const express = require("express");
const { userAuth } = require("../middleWares/auth");
const ConnectionRequestModel = require("../model/connectionRequest");
const userRouter = express.Router()

const USER_PUBLIC_DATA = "Fname Lname age gender"

userRouter.get("/user/requests/received", userAuth, async(req, res)=>{
    // Get all the pending connection request for the loggedIn User
    try {
        const loggedInUser = req.user;
        const connectionRequest = await ConnectionRequestModel.find({
            toUserId: loggedInUser._id,
            status : "interested"

        }).populate("fromUserId", USER_PUBLIC_DATA)

        res.json({
            message: "Data fetched succesfully",
            data: connectionRequest

        })

    } catch (err) {

        res.status(400).send("Error: "+err);
        
    }

})

userRouter.get("/user/connections", userAuth, async(req, res)=>{

    try {
    const loggedInUser = req.user;
    const connectionRequest = await ConnectionRequestModel.find({
        $or:[
            {toUserId:loggedInUser._id},
            {fromUserId:loggedInUser._id} 
            
        ],
        status: "accepted"
        
    })
    .populate("fromUserId", USER_PUBLIC_DATA)
    .populate("toUserId", USER_PUBLIC_DATA)

    const data = connectionRequest.map((row) => {
        if (row.fromUserId._id.toString() == loggedInUser._id.toString()) {
           return row.toUserId; 
        }
        return row.fromUserId;
    })

    res.json({
        message:"Total Connections",
       data: data})

    } catch (err) {
        res.status(400).send("Error "+err)
    }

} )

module.exports  = userRouter;