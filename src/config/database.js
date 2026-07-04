
const mongoose = require('mongoose');

const connectDB = async () =>{
   console.log(process.env.DB_SECRET_KEY);
    await mongoose.connect(
   
      process.env.DB_SECRET_KEY
    ); 
}


module.exports = connectDB;
