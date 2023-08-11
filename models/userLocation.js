const mongoose = require("mongoose")

const locationSchema = new mongoose.Schema({
    state:{
      type:String,
  },
  
    city: {
      type:String,
  },

    pincode: {
      type:String,
  },
  }, {timestamps:true});
  
 module.exports = mongoose.model('Location', locationSchema);










