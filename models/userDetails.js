const mongoose = require("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId


const userDetails = mongoose.Schema({
    userObjectId:{
type:ObjectId,
ref:"user"
    },

name:{
    type:String,
   default:""
},
address:{
pincode:{
    type:String,
    default:""
},
locality: {
    type: String,
    default:""
  },
},
customerNumber:{ 
    type:String,
},
customerId:{
    type:String,
},

joinedDate:{
    type:String,
},

},{ timestamps: true })

module.exports = mongoose.model("CustomerDetails",userDetails)



