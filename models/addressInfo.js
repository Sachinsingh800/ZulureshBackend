const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const userAddressSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    phoneNo: {
      type: String,
      required: true,
    },
    houseFlatNo: {
      type: String,
      required: true,
    },

    blockName: {
      type: String,
    },
    street: {
      type: String,
      required: true,
    },

    landMark: {
      type: String,
    },

    pinCode: {
      type: String,
      required: true,
    },
    locality: {
      type: String,
      required: true,
    },

    saveAddressAs: {
      type: String,
      enum: ["Home", "Work", "Other"],
      required: true,
    },

    // delivery slot

    // deliverySlot: {
    //   type: String,
    //   required: true,
    // },

    // deliverySlot: {
    //   day: {
    //     type: String,
    //     required: true,
    //   },
    //   startTime: {
    //     type: String,
    //     required: true,
    //   },
    //   endTime: {
    //     type: String,
    //     required: true,
    //   },
    // },

  
    userId: {
      type: ObjectId,
      refs: "user",
      required: true,
    },
    userID: {
      type: String,
    },
setAsDefault:{
  type:Boolean,
  default:false
},

  },
  { timestamps: true }
);

module.exports = mongoose.model("UserAddress", userAddressSchema);

// todo: user can add new address / update any particular address / delete address / can see all added address
