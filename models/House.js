const mongoose = require('mongoose')

const HouseSchema = new mongoose.Schema({
    user_id:{ type: mongoose.SchemaTypes.ObjectId,required: true, index: true } ,
    name:{type : String,require:true},
    approve:Boolean,
    active:Boolean,
    deleted:false,
    type:String,
    images:[String],
    description:String,
    phone:[String],

    prices:[{}],
    services:[],
    veiws:Number,
    likes:Number,
    
    address:{
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