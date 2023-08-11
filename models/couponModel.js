const mongoose = require("mongoose")

const couponSchema = new mongoose.Schema ({
    promoCode:{
        type:String,
        required:true,
        unique:true
    },
    expiry:{
        type:Date,
        required:true
    },
    discount:{
        type:Number,
        required:true,
    }
})

module.exports = mongoose.model("Coupon", couponSchema)

