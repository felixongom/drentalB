const mongoose = require('mongoose')

const Booking = new mongoose.Schema({
    bookeeId: String,
    houseOwner:String,
    bookeePhone:String,
    houseId:String,
    price:{type : Number,require:true},
    duration:{type : String,require:true},
    active:Boolean,
  
}, {timestamps:true})

module.exports = mongoose.model("Booking", Booking)