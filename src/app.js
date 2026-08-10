
const express = require("express");
const app = express()

const connectDB = require("./config/database")
const User = require("./model/user")
const cookieParser = require('cookie-parser')
const { setupWebSocket } = require("./utils/socket");
const cors = require("cors");
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const http = require("http");
// const WebSocket = require("ws");
const { Server } = require("socket.io");

require('dotenv').config()
const port = process.env.PORT || 5500;

const corsOptions = {
  origin: ['http://localhost:5173', "https://devloper-tinder.vercel.app/"], // Allow request from frontend
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'], // Explicitly allow PATCH
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true // Enable 
};

app.use(cors(corsOptions));

// Handle Preflight Requests 


app.use(express.json())
app.use(cookieParser())
/** it tell the Express app
 * Whenever a request comes with JSON data in the body, automatically parse it and convert it into a JavaScript object.”
 */

const authRouter = require('./routes/auth')
const profileRouter = require('./routes/profile')
const requestRouter = require('./routes/request');
const userRouter = require("./routes/user");
const userAuth = require("./middleWares/auth");

app.use("/", authRouter)
app.use("/", profileRouter)
app.use("/", requestRouter)
app.use("/", userRouter)

const server = http.createServer(app);
setupWebSocket(server) // call the web-socket


// Get user by email
app.get("/user", async (req, res) => {
    const userEmail = req.body.emailId;

    try {
        // console.log(userEmail);
        const user = await User.findOne({ emailId: userEmail }); // find One user
        if (!user) {
            res.status(404).send("User not Found")

        } else {

            res.send(user)
        }

    } catch (err) {
        res.status(400).send("Something went Wrong");

    }

})

app.get("/test", (req, res) => {
    res.send("Working Fine");
});


connectDB()
  .then(() => {
    console.log("Database connection established...");
    server.listen(process.env.PORT, () => {
      console.log("Server is successfully listening on port 5700...");
    });
  })
  .catch((err) => {
    console.error("Database cannot be connected!!");
  });
