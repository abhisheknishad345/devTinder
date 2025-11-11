
const express = require("express")

const app = express()

app.use("/user", (req, res) =>{
    res.send("Order Matters, maintain your order")
})

// this will match the all http method API call to /test
app.use("/test",(req, res) => {
    res.send("Hello from the server! TEST")
    
});

// This will only handle GET call to /user
app.get("/user", (req, res) =>{
    res.send({firstname:"Anhishek", lastname:"Kumar", title:"Postman"})
})

app.post("/user", (req, res) =>{
    // Data is save to DB
    res.send("Data is succesfully post to DB")
})

app.delete("/user", (req, res) =>{
    // Data is deleted from DB
    res.send("Data is succesfully deleted")
})



// app.use("/",(req, res) => { // it matches anything after "/", but if order is change then it not work
//     res.send("Namaste Abhishek")
// });

app.listen(5700, () =>{
    console.log("Server is succesfully listening..."); 


});