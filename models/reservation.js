const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    restaurent:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Restaurent',
        required:true
    },
    date:{
        type:Date,
        default:Date.now()
    },
    time:{
        type:String,
        required:true
    },
    numberofpeople:{
        type:Number,
        required:true
    }
});


const Reservation = mongoose.model("Reservation", reservationSchema);

module.exports = Reservation;