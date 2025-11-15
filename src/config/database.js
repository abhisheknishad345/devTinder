
const mongoose = require('mongoose');

 const connectDB = async () =>{
    await mongoose.connect(
    "mongodb+srv://abhishekk77625_db_user:Mongo_for_node@nodemongo.i8pe3pj.mongodb.net/devTinder"
); 
}



 

module.exports = connectDB;
