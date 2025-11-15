/********* TODAY'S TOPIC IS Middleware ******************/

const express = require("express")

const app = express()
const port = 5700;

const {adminAuth, userAuth} = require("../src/middleWares/auth")

// GET /user => it check all the app.xyz("matching route") function
/*
app.use("/", (req, res, next) =>{
    // res.send("Handling / Route")
    next()


})

app.get("/user",
    (req, res, next) =>{
    console.log("Handling /user route");
    next()
}, (req, res, next)=>{
    res.send("1st route handler")

}, (req, res) =>{
    res.send("2nd route handler")

})

*/

// handle Auth middleware for all request GET, POST
app.use("/admin", adminAuth)
// app.use("/user", userAuth)

app.get("/user/data",userAuth, (req, res, next) =>{
    res.send("User data send")
} );

app.get("/user/register", userAuth, (req, res) =>{
    res.send("User registered")
});

app.get("/user/forgotPassword", userAuth, (req, res) =>{
    res.send("User forgot the password")
});



app.get("/user/login", (req, res) =>{
    res.send("User logged in")
})


app.get("/admin/getAllData",  (req, res) =>{
    // Logic of checking if the request is authorised 
    res.send("All Data sent")
    
})

app.get("/admin/deleteUser",  (req, res) =>{
    // Logic of checking if the request is authorised 
    res.send("Deleted a user")

})



app.listen(port, () =>{
    console.log("Server is listening on port:", port);
})