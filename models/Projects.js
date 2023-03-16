const mongoose = require('mongoose')

const projectSchema = new mongoose.Schema({
    user_id:String,
    project: {
        type : String,
        required:true,
    },
  
    description: {
        type : String,
        required:true,
    },
    duration: {
        type : String,
        required:true,
    }, 
    logo:{
        type:String,
        max:300,
        required:true
    },
    active: {
        type : String,
        required:true,
    },
}, {timestamps:true})

module.exports = mongoose.model("Project", projectSchema)