
const express = require("express");
const connectDB = require("./config/database")
const User = require("./model/user")
const cookieParser = require('cookie-parser')
const bodyParser = require("body-parser");

const app = express()
const port = 5700;

app.use(bodyParser.json());
app.use(cookieParser())
app.use(express.json())
/** it tell the Express app
 * Whenever a request comes with JSON data in the body, automatically parse it and convert it into a JavaScript object.”
 */

const authRouter = require('./routes/auth')
const profileRouter = require('./routes/profile')
const requestRouter = require('./routes/request')

app.use("/", authRouter)
app.use("/", profileRouter)
app.use("/", requestRouter)


// Get user by email
app.get("/user", async (req, res) =>{
    const userEmail = req.body.emailId;

    try {
        // console.log(userEmail);
        const user = await User.findOne({emailId: userEmail}); // find One user
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
app.get("/feed", async (req, res) =>{

    try {
        const users = await User.find({}) // get all data of 'json'
        res.send(users)
    } catch (err) {
        res.status(400).send("Something went Wrong")
        
    }
    

})

/*********** Delete User API */
app.delete("/delete", async (req, res) =>{
    // const deletedUser = req.body.Lname;
    const userId = req.body.userId;
    
    try {
        
        console.log("Deleted:" ,userId);
        // const user = await User.findOneAndDelete({ Lname: deletedUser });
        const user = await User.findByIdAndDelete({_id: userId}); // it work
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


/************ Update User API PUT*/

app.patch("/patchupdate/:userId", async (req, res) =>{
    const userId = req.params.userId;
    const data = req.body;

     try {
    const Allowed_Updates = ["about", "gender", "age", "skills", "password", "profileurl"];
    
    const isUpdateAllowed = Object.keys(data).every((k) => Allowed_Updates.includes(k))
    if (!isUpdateAllowed) {
        throw new Error("This update is not allowed");
        };

        // if(data?.skills.length > 6){
        //     throw new Error("Skills cannot be more than 10")
        // }
   
       const user =  await User.findByIdAndUpdate({_id: userId}, data, {
         runValidators: true,
        // returnDocument: "before" // return old data
       // returnDocument: "after", // return updated data
        new : true // return updated data, without it , return old data
       });
        console.log("Updated:", user);
        res.json( {message: "User updated succesfully", user})
        
    } catch (err) {
        res.status(500).send("Updates Failed: "+ err.message)
        
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
