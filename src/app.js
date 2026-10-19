
const express = require("express");
const app = express()
app.set("trust proxy", 1);
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const { GoogleGenAI } = require("@google/genai");
const connectDB = require("./config/database")
const cookieParser = require('cookie-parser')
const { setupWebSocket } = require("./utils/socket");
const startKeepAlive = require("./jobs/keepAlive");

const cors = require("cors");
const http = require("http");
require('dotenv').config()

const PORT = process.env.PORT || 5700;

const corsOptions = {
  origin: "https://devloper-tinder.vercel.app",
//   origin: "http://localhost:5173", // Allow request from frontend
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true // Enable 
};

app.use(cors(corsOptions));

app.use(express.json())
app.use(cookieParser())
/* it tell the Express app
 Whenever a request comes with JSON data in the body, automatically parse it and convert it into a JavaScript object.
 */

const authRouter = require('./routes/auth')
const profileRouter = require('./routes/profile')
const requestRouter = require('./routes/request');
const userRouter = require("./routes/user");
const chatRouter = require("./routes/chat");
const postRouter = require("./routes/post")

app.use("/", authRouter)
app.use("/", profileRouter)
app.use("/", requestRouter)
app.use("/", userRouter)
app.use("/", chatRouter)
app.use("/", postRouter)

const server = http.createServer(app);
setupWebSocket(server) // call the web-socket

app.get("/test", (req, res) => {
    res.send("Server is Working Fine");
});


app.get("/health", (req, res) => {
  res.status(200).json({ 
    status: "ok",
    message: "DevTinder Server is Healthy !!", 
    time: new Date().toISOString() });
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
    server.listen(PORT, () => {
      console.log(`Server running on port...${PORT}`);
      startKeepAlive();
    });
  })
  .catch((err) => {
    console.error("Database cannot be connected!!");
  });
