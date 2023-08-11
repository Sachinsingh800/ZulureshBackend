const mongoose = require("mongoose")

const userSchema = mongoose.Schema({

number:{
    type:String,
    required:true
},
userId: {
    type:String,
}
},
{timestamps:true})

module.exports = mongoose.model("user", userSchema)


 