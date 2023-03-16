const { boolean, string, date } = require('joi')
const mongoose = require('mongoose')

const HouseSchema = new mongoose.Schema({
    user_id:{type : String, require:true},
    name:{type : String,require:true},
    approve:Boolean,
    active:Boolean,
    images:[String],
    description:String,
    phone:[String],
    prices:[
        { price:String}, 
        {duration:String}
    ],
    services:[],
    
    adress:{
        region:String,
        district:String,
        town:String,
        subcounty:String,
        parish:String,
        village:String,
        street:String
    }


   
}, {timestamps:true})

module.exports = mongoose.model("House", HouseSchema)