
const express = require("express");
const app = express()
const { GoogleGenAI } = require("@google/genai");


const connectDB = require("./config/database")
const User = require("./model/user")
const cookieParser = require('cookie-parser')
const { setupWebSocket } = require("./utils/socket");
const cors = require("cors");

const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const http = require("http");

require('dotenv').config()
const port = process.env.PORT || 5500;

const corsOptions = {
  origin: "https://devloper-tinder.vercel.app",
//   origin: "http://localhost:5173", // Allow request from frontend
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
const chatRouter = require("./routes/chat");

app.use("/", authRouter)
app.use("/", profileRouter)
app.use("/", requestRouter)
app.use("/", userRouter)
app.use("/", chatRouter)

const server = http.createServer(app);
setupWebSocket(server) // call the web-socket


// Get user by email
app.get("/user", async (req, res) => {
    const userEmail = req.body.emailId;

    try {
        
        const user = await User.findOne({emailId: userEmail}).select("Fname Lname age gender about skills -_id"); // find One user

        if (!user) {
          return  res.status(404).send("User not Found")

        } 

        res.send(user)

    } catch (err) {
        res.status(400).send("Something went Wrong");

    }

})

app.get("/test", (req, res) => {
    res.send("Server is Working Fine");
});

app.get("/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "DevTinder server is healthy"
    });
});

// Google gemini api test

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

app.get( "/gemini-test", async (req, res) => {

    const {problem} = req.body;
    try {
        const response = await ai.models.generateContent({
            model: "gemini-3.5-flash-lite",
            contents: problem
        });


        res.json({
            answer: response.text
        });

    } catch (error) {

        res.status(500).json({
            message: "Gemini API failed"
        });
    }
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
