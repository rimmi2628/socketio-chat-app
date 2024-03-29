const { Timestamp } = require('mongodb');
const mongoose=require('mongoose');



const ChatSchema=mongoose.Schema({
    sender_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    receiver_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    message:{
        type:String,
        require:true
    },
    
},
{Timestamp:true}

)

module.exports=new mongoose.model("Chat",ChatSchema)