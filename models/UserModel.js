const { Timestamp } = require('mongodb');
const mongoose=require('mongoose');


const UserSchema=mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    },
    is_online:{
        type:String,
        default:'0'
    },
    image:{
        type:String,
        require:true
    },
    
},
{Timestamp:true}

)

module.exports=new mongoose.model("User",UserSchema)