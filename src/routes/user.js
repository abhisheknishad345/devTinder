
const express = require("express");
const { userAuth } = require("../middleWares/auth");
const ConnectionRequestModel = require("../model/connectionRequest");
const userRouter = express.Router()
const User = require("../model/user")
const mongoose = require("mongoose");

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
    const loggedInUserId = req.user._id;

    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = 6;
    const skip = (page - 1) * limit;

    // ids only, plain objects, no _id field
    const connectionRequest = await ConnectionRequestModel.find(
      { $or: [{ fromUserId: loggedInUserId }, { toUserId: loggedInUserId }] },
      { fromUserId: 1, toUserId: 1, _id: 0 }
    ).lean();

    // include self in hidden
    const hideUserfromFeed = new Set([loggedInUserId.toString()]);
    connectionRequest.forEach((req) => {
      hideUserfromFeed.add(req.fromUserId.toString());
      hideUserfromFeed.add(req.toUserId.toString());
    });

    const hideIds = [...hideUserfromFeed].map((id) => new mongoose.Types.ObjectId(id));

    const users = await User.find({ _id: { $nin: hideIds } })
      .select(USER_PUBLIC_DATA)
      .sort({ _id: -1 }) // stable order so pages don't repeat or skip users
      .skip(skip)
      .limit(limit)
      .lean();

    res.status(200).json({
      message: "Total people in feed",
      data: users,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
});

//  console.log("Logged user ID:", req.user._id);

// now Pagination - help to divide the large dataset into smaller chunk and managable dataset




module.exports = userRouter;