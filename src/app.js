
const express = require("express")

const app = express()

app.use("/test",(req, res) => {
    res.send("Hello from the server! TEST")
    
});

app.use("/hello/2",(req, res) => {
    res.send("Hello from the server! HELLO 2")
})

app.use("/hello",(req, res) => {
    res.send("Hello from the server! HELLO ")
})

app.use("/",(req, res) => { // it matches anything after "/", but if order is change then it not work
    res.send("Namaste Abhishek")
    
});

app.listen(5700, () =>{
    console.log("Server is succesfully listening...");

});