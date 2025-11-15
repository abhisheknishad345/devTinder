
const express = require("express");
const connectDB = require("./config/database")
const User =  require("./model/user")


const app = express()
const port = 5700

app.post("/signup", async (req, res) =>{

    const userObj =new User ({
        Fname: "Mahendra",
        Lname: "Kohli",
        emailId: "mahendra533@gmail.com",
        password: "kohli@125",
        age: 21,

    });

    // Creating a new instance of User Model
   // const user = new User(userObj)

   try {
    
       await userObj.save();
       res.send("User added succesfully")
   } catch (err) {
    res.status(404).send("Error saving signup", err.message)
    
   }

})

connectDB().then(()=>{
    console.log("Database is connected...");

} ).catch((err) =>{
    console.error("Database is not Connected...");
})



app.listen(port, () =>{
    console.log("Server is succesfully listening.. at port", port); 


});