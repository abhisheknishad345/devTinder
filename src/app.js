
const express = require("express")

const app = express()
const port = 5700

/************************** COMMENT ************************/
/*


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

*/

// it work for both "/abc" and "/ac" when "?" is there after "b"
// app.get(/.*fly$/, (req, res) =>{
//     res.send({Fname:"Vikash", Lname:"Kumar Fly"})
// })

app.get("/user/:userId/:name/:password", (req, res) =>{
    // console.log(req.query);
    console.log(req.params);
    res.send({Fname:"Vikash", Lname:"Kumar Fly User Testing"})
})



app.listen(port, () =>{
    console.log("Server is succesfully listening.. at port", port); 


});