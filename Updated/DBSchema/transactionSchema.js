const mongoose = require("mongoose");

const Schema = mongoose.Schema({
    user_id:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "registereduser"
    },
    manager_id:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "registereduser"
    },
    type: {
        type: String,
        enum: ['debit', 'credit'],
        required: [true, "Please Enter the name"]
    },
    amount: {
        type: String,
        required: [true, "Please Enter Office Name"]
    }
}
)

module.exports = mongoose.model("Transaction", Schema)