const mongoose = require("mongoose")


const shippingChargeSchema = new mongoose.Schema({

freeShipingLimit:{
    type:Number,
}, // free shipping limit 

shippingCharge:{
    type: Number,
      required: true, //  shipping charge
},

},{ timestamps: true } )

module.exports = mongoose.model("ShippingCharge", shippingChargeSchema)


     