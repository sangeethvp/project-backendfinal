const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    restaurent:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Restaurent",
        required:true
    },
    name:{
        type:String,
        required:true
    },
    ratings:{
        type:Number,
        min:1,
        max:5,
        required:true
    },
    comments:{
        type:String
    },
    date:{
        type:Date,
        default:Date.now()
    },
    reply:{
        type:String,
        
    }
   
});

const Review = mongoose.model('Review',reviewSchema);
module.exports = Review;