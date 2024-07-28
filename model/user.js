const mongoose = require('mongoose')

//define user Schema model
const userschema =new mongoose.Schema({
    Username: {type:String,required:true,unique:true},
    Email: {type:String,required:true,unique:true},
    Phone: {type:String,required:true},
    Gender: {type:String,required:true},
    Password: {type:String,required:true}
})

const User = mongoose.model('User',userschema)

module.exports = User