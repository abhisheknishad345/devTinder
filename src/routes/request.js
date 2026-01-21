
const express = require('express')
const requestRouter = express.Router()

const { userAuth } = require('../middleWares/auth')
const ConnectionRequestModel = require('../model/connectionRequest')
const User = require('../model/user')


//**  SendConnectionReq API */

requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {

    try {

        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        // console.log(ConnectionRequestModel);
        const allowed = ["ignored", "interested"]

        if (!allowed.includes(status)) {
            return res.status(400).json({ message: "Invalid status type: " + status })

        }

        // IF there is an existing ConnectionRequest
        const existingConnectionReq = await ConnectionRequestModel.findOne({
            $or: [ // query in Mongoose
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }

            ]
        })

        const toUser = await User.findById(toUserId);

        if (!toUser) {
            return res.status(404).json({ message: "User not found" });
        }


        if (existingConnectionReq) {
            return res.status(400).json({ message: "Connection Req Already Exist" })

        }

        const connectionId = new ConnectionRequestModel({
            fromUserId,
            toUserId,
            status
        })

        const data = await connectionId.save();

        res.json({
            message: req.user.Fname + " is " + status + " in " + toUser.Fname,
            data
        })
    } catch (err) {

        res.status(400).send("ERROR: " + err)

    }


})
module.exports = requestRouter;
