const mongoose = require("mongoose");

const dbSchema = mongoose.Schema({
    user_id:{
        type: mongoose.Schema.Types.ObjectId,
        required: function () {
            return this.role !== 'super_admin' && this.role !== 'admin';
        }
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
        enum: ['super_admin', 'admin', 'manager', 'employee'], 
        required: true },
})

module.exports = mongoose.model("registereduser", dbSchema);