
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

// app.get("/user/:userId/:name/:password", (req, res) =>{
//     // console.log(req.query);
//     console.log(req.params);
//     res.send({Fname:"Vikash", Lname:"Kumar Fly User Testing"})
// })


/****************** PUT and PATCH *********************/
/*
let user = {
  id: 1,
  name: "Abhishek",
  email: "abhi424@example.com",
  role: "user"
};

app.put("/user/:id", (req, res) => {
  const { id } = req.params;
  const updatedUser = req.body;

  if (parseInt(id) === user.id) {
    user = updatedUser; // Replace entire object
    res.json({ message: "User replaced", user });
  } else {
    res.status(404).json({ error: "User not found" });
  }
});

app.patch('/user/:id', (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  if (parseInt(id) === user.id) {
    user = { ...user, ...updates }; // Merge updates
    res.json({ message: "User updated", user });
  } else {
    res.status(404).json({ error: "User not found" });
  }
});

*/



app.listen(port, () =>{
    console.log("Server is succesfully listening.. at port", port); 


});