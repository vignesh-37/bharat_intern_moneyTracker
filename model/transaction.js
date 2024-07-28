const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    user:{
        type:String,
        required:true
    },
    Category:{
        type:String,
        required:true,
    },
    Amount:{
        type:Number,
        required:true
    },
    Description:{
        type:String
    },
    Date:{
        type:Date,
        default:Date.now
    }
})

const transaction = mongoose.model('moneytrace',userSchema)
module.exports = transaction