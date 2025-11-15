/****************** Error Handler **************/
const express = require("express")

const app = express()
const port = 5700;

app.get("/getUserData", (req, res) =>{
// Logic for DB Call and get user data
    // suppose you have some error , then how you handle it
try {
    throw new Error("gfdjnd");
    res.send("User Data send")
    
} catch (err) {

    console.log("Your system has some error");
    res.status(500).send("Some Error, sontact support team")
    
}
})

app.use("/", (err, req, res, next) =>{
    if (err) {
        // Log your error message
        console.log("Your system has some error");
        res.status(500).send("Something went Wrong!!")
        
    }
})

app.listen(port, () =>{
    console.log("Server is listening on port:", port);
})