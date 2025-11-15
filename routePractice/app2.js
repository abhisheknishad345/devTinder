const express = require("express")

const app = express()
const port = 5700

app.use("/user",
    (req, res, next) =>{
    // Route Handler 1
    // res.send("Route Handler 1")/
    console.log("Handling the route 1 user");
    next();
    // res.send("Response !!")

}, (req, res, next) =>{
    // route handler 2
    console.log("Handling the route 2 user");
    next()
    // res.send("2nd Response !!")
}, (req, res, next) =>{
    // route handler 2
    console.log("Handling the route 3 user");
    next()
    // res.send("3rd Response !!")
}, (req, res, next) =>{
    // route handler 2
    console.log("Handling the route 4 user");
    res.send("4th Response !!")
    // next()
}
    )

app.listen(port, () =>{
    console.log("Server is succesfully listening.. at port", port); 


});