const mongoose = require('mongoose')

const PriceSchema = new mongoose.Schema({
    price:Number
}, {timestamps:true})

module.exports = mongoose.model("Price", PriceSchema)