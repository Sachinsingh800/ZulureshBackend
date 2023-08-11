const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },

    weightperKg: {
      type: Number,
    }, 

    pieces: {
      type: Number,
    },

    MRP: {
      type: Number,
      rquired: true,
    },
    price: {
      type: Number,
      required: true,
    },

    discount: {
      type: String,
    },

    productImg: [
      {
        public_id: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
      },
    ],
    category: {
      type: String,
    },

    sub_category: {
      type: String,
    },

    Stock: {
      type: Number,
      required: true,
      default: 1,
    },
    setAs:{
      type:String,
      enum:["None", "Best Seller" , "Best Deals", "Combos" ],
      default: "None"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
