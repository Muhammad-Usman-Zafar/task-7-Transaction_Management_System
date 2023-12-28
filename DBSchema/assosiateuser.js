const mongoose = require("mongoose");

const dbSchema = mongoose.Schema({
    user_id:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "registereduser"
    },
    name: {
        type: String,
        required: [true, "Name is required"]
    },
    email: {
        type: String,
        required:[true, "Enter Email Address"],
        unique: [true, "The email address is already resgistered."]
    },
    password: {
        type: String,
        required: [true, "Please Enter Password"]
    }, 
    role: { 
        type: String,
        enum: ['admin', 'manager', 'employee'], 
        required: true },
})

module.exports = mongoose.model("Assosiated User", dbSchema);