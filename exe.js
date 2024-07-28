/*const crypto = require('crypto');
const secret = crypto.randomBytes(64).toString('hex');
console.log(secret);


const bcrypt = require('bcrypt')
const password='12345'
 async function hash(pass){
const hashedPassword = await bcrypt.hash(password, 10);
console.log(hashedPassword)
const comp =await bcrypt.compare(password,hashedPassword)
console.log(comp)
if(comp){
    console.log('true')
}
else{
    console.log('false')
}
}

hash(password)*/

const user = require('./model/user')
const mongoose = require('mongoose')
mongourl = "mongodb://localhost:27017/MoneyTracker"
mongoose.connect(mongourl).then(()=>{console.log('Database conected')})
const find = async(req,res)=>{
    let username = "Dharsan1234"
    try{
        console.log( await user.findOne({Username:username}))
    }
    catch(err){
        console.log(err.message)
    }
    
}
find ()
