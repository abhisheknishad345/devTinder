
const express = require("express");
const connectDB = require("./config/database")
const User = require("./model/user")
const {validateSinupData} = require('./utils/validation')
const bcrypt = require("bcrypt");
const { cookie } = require("express-validator");
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken');

const app = express()
const port = 5700;

app.use(express.json())
app.use(cookieParser())


/** it tell the Express app
 * Whenever a request comes with JSON data in the body, automatically parse it and convert it into a JavaScript object.”
 */

app.post("/signup", async (req, res) => {
    // Validation of data
    validateSinupData(req)
    const {Fname,Lname,password,emailId} = req.body;
    // Encrypt the password
    // const passwordHash = await bcrypt.hash(password, 10)
    // console.log("Hash Format: " +passwordHash);
    // Store the data in DB

    // console.log(req.body); // give "undefined", to avoid it use 'Express.json' which convert the json data in JS Object format and U will need a middleware


    //     // Creating a new instance of User Model
    
    //         Fname: "JJ",
    //         Lname: "Thomson",
    //         emailId: "jjt533@gmail.com",
    //         password: "thomson@165",
    //         age: 21,
    
    try {
        const userObj = new User({
            Fname,
            Lname,
            // password: passwordHash,
            password,
            emailId
        });


        await userObj.save();
        res.send("User Added succesfully")
    } catch (err) {
        res.status(404).send("ERROR: " + err)

    }

})

// Login API
app.post("/login", async (req, res) =>{

    try {

        
        const {emailId, password} = req.body;
        const user = await User.findOne({emailId: emailId});
        if (!user) {
            throw new Error("Invalid Credentials")
            
        }
        // const isValidPassword = await bcrypt.compare(password, user.password);

        // if (isValidPassword) {
        if (password == user.password) {

            // Create a JWT Token(

            const token =  jwt.sign({_id: user._id}, "Dev@tinder$*55");
            console.log("Token:",token);

            /// Add token to the cookie and send the response back to user
            res.cookie("token",token)
            res.send("Login Succesfull !!");
            // console.log(object);
            
        } else {
            throw new Error("Invalid Credentials")

            // 6307478432
            
        }

    } catch (err) {
        res.status(404).send("Login ERROR: " + err.message)
        
        
    }

});

app.get("/profile", async (req, res) =>{
    const cookies = req.cookies;
     const {token} = cookies; 
     if (!token) {
        return res.status(401).send("No token found. Please login.");
    }
    // Validate my token
    try {
        const decodedMessage = jwt.verify(token, "Dev@tinder$*55");
        console.log(decodedMessage);

        const { _id } = decodedMessage;
        console.log("Logged in user ID:", _id);
        const user = await User.findById(_id)
        res.send(user)
        console.log(user);

       // res.send("Reading Cookie"); // cookie is send back after user Login

    } catch (err) {
        res.status(401).send("Invalid Token: " + err.message);
    }

     

})


// Get user by email
app.get("/user", async (req, res) =>{
    const userEmail = req.body.age;

    try {
        // console.log(userEmail);
        const user = await User.findOne({age: userEmail}); // find One user
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
app.put("/update", async (req, res) =>{
    const updateUser = req.body.Fname;
    const updateData = req.body.age;

    try {
        console.log(`User ${updateUser} got updated`);
        const user = await User.findOneAndUpdate({Fname: updateUser}, {age: updateData}, {new: true})
        // const user = await User.updateOne({Fname: updateUser}, {$set: {age: updateAge}}, {new: false})
        // updateOne find the user which is added in past and update it
        if (!user) {
            res.status(404).send("User is not Found")
        } else {
            res.json({message: "User updated", updateUser, updateData})
        }
    } catch (err) {

        res.status(500).send("Some error occured", err)
        
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