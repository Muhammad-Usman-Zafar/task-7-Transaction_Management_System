const mongoose = require("mongoose");

const dbConnection = async ()=>{
    try{
        await mongoose.connect(process.env.CONNECT_STRING)
        console.log("Connection Established..");
    }catch(error){
        console.log(error);
    }
    
    
}

module.exports = dbConnection;