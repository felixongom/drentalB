const mongoose = require('mongoose')

const imageShema = new mongoose.Schema({
    user_id:String,
    skill_id:String,
    image:String
}, {timestamps:true})

module.exports = mongoose.model('Images', imageShema)