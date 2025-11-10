
const express = require("express")

const app = express()

app.use("/test",(req, res) => {
    res.send("Hello from the server! TEST West")
    
});

app.use("/hello",(req, res) => {
    res.send("Hello from the server! HELLO 123")
})

app.listen(5700, () =>{
    console.log("Server is succesfully listening...");
});