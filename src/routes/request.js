
const express = require('express')
const requestRouter = express.Router()
const {userAuth} = require('../middleWares/auth')


// SendConnectionReq API

requestRouter.post("/sendConnectionReq", userAuth, async(req, res) =>{

    const user = req.user;

    console.log("Sending a connection request");
    res.send(user.Fname+" Send the Connection!!")

})
module.exports = requestRouter;
