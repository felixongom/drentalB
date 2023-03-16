const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type : String,
        required:true,
        min:5
    },
    email:{
        type:String,
        required:true,
        max:300,
        unique: true 
    
    },
    phone:{
        type:String,
        required:true,
        max:15,
    }, 
    password:{
        type : String,
        required:true,
        min:5,
        max:255
    },
    active:String,
    avater:String,
    usertype:String
    // skills:{
    //     type:[
    //         { 
    //         id:Number,
    //         name:String,
    //         decription:String,
    //         date:{
    //             type:Date,
    //             default:Date.now()
    //         }
    //     }
    // ]
    // },
    
}, {timestamps:true})

module.exports = mongoose.model("User", userSchema)