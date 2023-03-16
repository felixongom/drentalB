const mongoose = require('mongoose')

const userImagesShema = new mongoose.Schema({
    user_id:String,
    image:String
}, {timestamps:true})

module.exports = mongoose.model('userImages', userImagesShema)