const mongoose=require('mongoose')
const bcrypt = require("bcrypt");

const userSchema=new mongoose.Schema({
    email:{type:String, unique:true},
    password:{type:String}
})
userSchema.pre('save',async function(next){
    const salt=await bcrypt.genSalt();
    this.password=await bcrypt.hash(this.password,salt);
    // console.log('user about to created and saved',this);
    next(); 

})
module.exports=mongoose.model("user",userSchema)