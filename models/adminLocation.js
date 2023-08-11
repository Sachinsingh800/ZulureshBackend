const mongoose = require("mongoose")

const adminSetLocation = new mongoose.Schema({
    
pincode:{
    type:String,
},

},{timestamps:true})

module.exports = mongoose.model("Pincode", adminSetLocation)
 
