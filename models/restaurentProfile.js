const mongoose = require("mongoose");

const restaurentSchema = new mongoose.Schema({
    name:{
        type:String,
        required: true
    },
    cuisine:{
        type:[String],
        default:[],
        required : true
    },
    menu:[{
        food:{type:String,required:true},
        price:{type:Number,required:true}
    }],
    availability:{
        Totaltables:{type:Number,required:true},
        Booked:{type:Number,default:0}
    },
    images:{
        type:String
    },
    place:[{
        city:{type:String,required:true},
        address:{type:String,required:true}
    }],
    reviews:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Review",
        
    }]

});

const Restaurent = mongoose.model('Restaurent',restaurentSchema);
module.exports = Restaurent;