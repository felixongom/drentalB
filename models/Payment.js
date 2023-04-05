const mongoose = require('mongoose')

const Payment = new mongoose.Schema({
    payId: String,
    userId:String,
    houseId:String,
    amount:{type : Number,require:true},
    active:Boolean,
    phone:String,
  
}, {timestamps:true})

module.exports = mongoose.model("Payment", Payment)