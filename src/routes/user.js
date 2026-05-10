
const express = require("express");
const { userAuth } = require("../middleWares/auth");
const ConnectionRequestModel = require("../model/connectionRequest");
const userRouter = express.Router()
const User = require("../model/user")

const USER_PUBLIC_DATA = "Fname Lname age gender profileurl skills about"

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
    // Get all the pending connection request for the loggedIn User
    try {
        const loggedInUser = req.user;
        const connectionRequest = await ConnectionRequestModel.find({
            toUserId: loggedInUser._id,
            status: "interested"

        }).populate("fromUserId", USER_PUBLIC_DATA)

        res.json({
            message: "Data fetched succesfully",
            data: connectionRequest

        })

    } catch (err) {

        res.status(400).send("Error: " + err);

    }

})

userRouter.get("/user/connections", userAuth, async (req, res) => {

    try {
        const loggedInUser = req.user;
        const connectionRequest = await ConnectionRequestModel.find({
            $or: [
                { toUserId: loggedInUser._id },
                { fromUserId: loggedInUser._id }

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
            message: "Total Connections",
            data: data
        })

    } catch (err) {
        res.status(400).send("Error " + err)
    }

})

// Feed api - Pagination 

userRouter.get("/feed", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
       
        const userId = loggedInUser._id.toString();

        const page = parseInt(req.query.page) || 1;
        const limit = 6;
        const skip = (page - 1) * limit;

        const connectionRequest = await ConnectionRequestModel.find({
            $or: [
                { fromUserId: loggedInUser._id },
                { toUserId: loggedInUser._id }
            ]
        }).select("fromUserId toUserId");

        const hideUserfromFeed = new Set();

        connectionRequest.forEach((req) => {
            hideUserfromFeed.add(req.fromUserId.toString());
            hideUserfromFeed.add(req.toUserId.toString());
        });

        // include self in hidden
        hideUserfromFeed.add(userId);
        

        const users = await User.find({
            _id: { $nin: Array.from(hideUserfromFeed) }
        })
            .select(USER_PUBLIC_DATA)
            .limit(limit)
            .skip(skip);


            //  console.log("Feed IDs:", users.map(u => u._id.toString()));

        res.json({
            message: "Total people in feed",
            data: users
        });



    } catch (err) {
        res.status(404).send(err);
    }

    //  console.log("Logged user ID:", req.user._id);
       
});

// now Pagination - help to divide the large dataset into smaller chunk and managable dataset




module.exports = userRouter;