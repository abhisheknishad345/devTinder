
const express = require("express");
const app = express()
const cors = require("cors");
const http = require("http");
require('dotenv').config()
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '8.8.4.4']);
const { corsOptions } = require("./config/cors");
app.set("trust proxy", 1);
app.use(cors(corsOptions));
// app.options("/{*splat}", cors(corsOptions));

const connectDB = require("./config/database")
const cookieParser = require('cookie-parser')
const { setupWebSocket } = require("./utils/socket");
const startKeepAlive = require("./jobs/keepAlive");


const PORT = process.env.PORT || 5700;

app.use(cookieParser())
app.use(express.json())
/* it tell the Express app
 Whenever a request comes with JSON data in the body, automatically parse it and convert it into a JavaScript object.
 */

const authRouter = require('./routes/auth')
const profileRouter = require('./routes/profile')
const requestRouter = require('./routes/request');
const userRouter = require("./routes/user");
const chatRouter = require("./routes/chat");
const postRouter = require("./routes/post")
const googleRouter = require("./routes/google")

app.use("/", authRouter)
app.use("/", profileRouter)
app.use("/", requestRouter)
app.use("/", userRouter)
app.use("/", chatRouter)
app.use("/", postRouter)
app.use("/", googleRouter)

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
