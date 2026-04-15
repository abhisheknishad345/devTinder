
const express = require("express");
const connectDB = require("./config/database")
const User = require("./model/user")
const cookieParser = require('cookie-parser')
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express()
const port = 5700;

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"], // Use an array
    optionsSuccessStatus: 200,
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(bodyParser.json());
app.use(cookieParser())
app.use(express.json())
/** it tell the Express app
 * Whenever a request comes with JSON data in the body, automatically parse it and convert it into a JavaScript object.”
 */

const authRouter = require('./routes/auth')
const profileRouter = require('./routes/profile')
const requestRouter = require('./routes/request');
const userRouter = require("./routes/user");
const userAuth = require("./middleWares/auth")
app.use("/", authRouter)
app.use("/", profileRouter)
app.use("/", requestRouter)
app.use("/", userRouter)


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
        //   const users = await User.find({emailId: userEmail});
        //   if(users.length ===0){

        //       res.status(404).send("User not Found");
        //   } else {

        //       res.send(users)
        //   }

    } catch (err) {
        res.status(400).send("Something went Wrong");

    }

})

// Feed API - write a method so that when user signup to app then get that data and render it to UI
app.get("/feed", async (req, res) => {

    try {
        const users = await User.find({}) // get all data of 'json'
        res.send(users)
    } catch (err) {
        res.status(400).send("Something went Wrong")

    }


})

/*********** Delete User API */
app.delete("/delete", async (req, res) => {
    // const deletedUser = req.body.Lname;
    const userId = req.body.userId;

    try {

        console.log("Deleted:", userId);
        // const user = await User.findOneAndDelete({ Lname: deletedUser });
        const user = await User.findByIdAndDelete({ _id: userId }); // it work
        if (!user) {
            res.status(404).send("User not Exist")

        } else {
            // res.send("User deleted" ,deletedUser)
            res.json({ message: "User deleted successfully", userId });

        }

    } catch (err) {
        res.status(500).send("Some error occured", err);

    }

})

connectDB().then(() => {
    console.log("Database is connected...");

}).catch((err) => {
    console.error("Database is not Connected...");
})



app.listen(port, () => {
    console.log("Server is succesfully listening.. at port", port);


});
