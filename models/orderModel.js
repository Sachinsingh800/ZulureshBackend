const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const orderSchema = new mongoose.Schema(
  {
    shippingInfo: {
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
        required: true,
      },
      deliverySlot: {
        day: {
          type: String,
          required: true,
        },
        startTime: {
          type: String,
          required: true,
        },
        endTime: {
          type: String,
          required: true,
        },
      },
    },

    // products what is going to be order
    items: [
      {
        productId: {
          type: ObjectId,
          refs: "product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
      },
    ],

    // total Price of all proctuct + shipping
    shippingPrice: {
      type: Number,
      required: true
    },
    // if shipping then have to add
    totalPrice: {
      type: Number,
      required: true,
      default: 0,
    },
    // total item what is going to be order by this user
    totalItems: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      cod: {
        type: Boolean,
        default: false,
      },
      online: {
        type: Boolean,
        default: false,
      },
    },
    // payment information ...
    paymentInfo: {
      id: {
        type: String,
        // required: true,
      },
      status: {
        type: String,
        // required: true,
      },
    },
    paidAt: {
      type: String,
    },

    orderStatus: {
      type: String,
      required: true,
      default: "Processing",
    },

    deliveredAt: {
      type: String,
    },

    userId: {
      type: ObjectId,
      ref: "user",
      required: true,
    },

    orderId:{
      type:String,
    },
    userID: {
      type: String,
    },

  },





  { timestamps: true }
);

module.exports = mongoose.model("order", orderSchema);
