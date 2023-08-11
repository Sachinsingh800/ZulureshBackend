const { isValidObjectId } = require("mongoose");
const cartModel = require("../models/cartModel");
const User = require("../models/userModel");
const Product = require("../models/productModel");
const TimeSlot = require("../models/timeSlot");
const Shipping = require("../models/delivereyChargeModel")
const moment = require("moment");


//////////////////////////////////////// create kart ////////////////////////////////////////////////////

exports.createCart = async (req, res) => {
  try {
    const userId =  req.user._id

    let cartChecking = await cartModel.findOne({userId: userId }).select({_id:1});
let cartId  = (cartChecking._id).toString()
    const cartData = req.body;

    let { productId } = cartData; // if cart is already then cart id you have to pass in the body

    if (Object.keys(cartData).length == 0) {
      return res
        .status(400)
        .send({ status: false, message: "can't create data with empty body" });
    }
    if (cartId) {
      // cartId = cartId.trim();
      if (!isValidObjectId(cartId))
        return res
          .status(400)
          .send({ status: false, message: "Invalid CartId" });
      var cartExist = await cartModel.findOne({ _id: cartId, userId: userId });
      if (!cartExist) {
        return res
          .status(400)
          .send({ status: false, message: "There is no product in the cart" });
      }
    }

    if (!productId) {
      return res
        .status(400)
        .send({ status: false, message: "please add your Product " });
    }

    productId = cartData.productId = productId.trim();
    if (!isValidObjectId(productId)) {
      return res
        .status(400)
        .send({ status: false, message: "Invaild product ID" });
    }
    let product = await Product.findOne({
      _id: productId,
    });

    if (!product) {
      return res.status(400).send({
        status: false,
        message: "Product doesn't exists for this product Id",
      });
    }

    if (cartData.quantity == 0) {
      return res.status(400).send({
        status: false,
        message: "you can't add 0 quantity of any item in your cart",
      });
    }
    if (!cartData.quanttity) {
      cartData.quantity = 1;
    }
    let quantity = cartData.quantity;
    let totalPrice = product.price * quantity;

    // if user already has some items added in the cart want to increase quantity of the product then
    if (cartId) {
      let productPresent = cartExist.items;
      for (let i = 0; i < productPresent.length; i++) {
        if (productPresent[i].productId == productId) {
          let index = i;
          let updatedproduct = productPresent[i];
          updatedproduct.quantity += quantity;
          productPresent.splice(index, 1, updatedproduct);

          let price = cartExist.totalPrice + product.price * quantity;

          totalItem = productPresent.length;
          let updateCart = await cartModel.findOneAndUpdate(
            { _id: cartId },
            { items: productPresent, totalPrice: price, totalItems: totalItem },
            { new: true }
          );

          return res.status(200).send({ status: false, data: updateCart });
        }
      }

      // user already has cart and some items want to add new product in the cart then

      let newItems = {
        productId: productId,
        quantity: quantity,
      };

      price = cartExist.totalPrice + product.price * quantity;

      cartExist.items.push(newItems);
      totalItem = cartExist.items.length;

      let newItemCart = await cartModel.findByIdAndUpdate(
        { _id: cartId },
        { items: productPresent, totalPrice: price, totalItems: totalItem },
        { new: true }
      );
      return res
        .status(200)
        .send({ status: true, message: "Success", data: newItemCart });
    }

    let items = {
      productId: productId,
      quantity: quantity,
    };
    let cartAlreadyExist = await cartModel.findOne({ userId: userId });
    if (cartAlreadyExist) {
      return res.status(400).send({
        status: false,
        message:
          "cart already exist for this user , Please send cart id in the request",
      });
    }
    let cart = await cartModel.create({
      userId: userId,
      userID:req.user.userId,
      items: items,
      totalPrice: totalPrice,
      totalItems: 1,
    });

    return res
      .status(201)
      .send({ status: true, message: "success", data: cart });
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};

////////////////////////////////////////// Update Kart //////////////////////////////////////////////////

exports.updateKart = async (req, res) => {
  try {
    let data = req.body;

    // UI there will be two option or buttons 1 is to decrease product by one and one is two remove this product

    let userId = req.user._id;
    let cartChecking = await cartModel.findOne({userId: userId }).select({_id:1});
    let cartId  = (cartChecking._id).toString()

    let { productId, removeProduct } = data;

    if (!removeProduct) {
      return res.status(400).send({
        status: false,
        message: "Please provide removeProduct attribute",
      });
    }
    removeProduct = Number(removeProduct);
    if (isNaN(removeProduct) || (removeProduct != 1 && removeProduct != 0)) {
      return res.status(400).send({
        status: false,
        message:
          "removeProduct can only contain +1(Remove 1 quantity) or 0(Remove all quantity)",
      });
    }

    if (Object.keys(data).length == 0)
      return res
        .status(400)
        .send({ status: false, message: "can't create data with empty body" });

    if (!productId) {
      return res.status(400).send({ status: false, message: "" });
    }
    productId = data.productId = productId.trim();

    if (!isValidObjectId(productId)) {
      return res
        .status(400)
        .send({ status: false, message: "Invalid product Id" });
    }

    let product = await Product.findById(productId);
    if (!product) {
      return res
        .status(400)
        .send({ status: false, message: "Product is not available to order" });
    }

    if (!cartId) {
      return res
        .status(400)
        .send({ status: false, message: "Cart id is mandatory" });
    }

    // cartId = data.cartId = cartId.trim();

    if (!isValidObjectId(cartId)) {
      return res
        .status(400)
        .send({ status: false, message: "Invalid cart Id" });
    }
    let isCartExist = await cartModel.findOne({ _id: cartId, userId: userId });

    if (!isCartExist) {
      return res.status(400).send({ status: false, message: "Cart is empty" });
    }
    let isMatchedProductId = isCartExist.items.findIndex((x) => {
      return x.productId.toString() == req.body.productId;
    });

    if (isMatchedProductId == -1) {
      return res.status(400).send({
        status: false,
        message: "this product is removed from the cart",
      });
    }

    let totalItems = isCartExist.totalItems,
      totalPrice;

    // this is for when user want to decerease product quantity by 1
    if (removeProduct == 1) {
      if (isCartExist.items[isMatchedProductId].quantity > 0) {
        isCartExist.items[isMatchedProductId].quantity -= 1;
        totalPrice = isCartExist.totalPrice - product.price;
      }

      if (isCartExist.items[isMatchedProductId].quantity == 0) {
        isCartExist.items.splice(isMatchedProductId, 1);
        totalItems = isCartExist.totalItems - 1;
      }
    }
    // when user want to remove this product from the cart
    if (removeProduct == 0) {
      totalItems = isCartExist.totalItems - 1;
      totalPrice =
        isCartExist.totalPrice -
        product.price * isCartExist.items[isMatchedProductId].quantity;
      isCartExist.items.splice(isMatchedProductId, 1);
    }

    let updateCart = await cartModel.findOneAndUpdate(
      { _id: cartId },
      {
        items: isCartExist.items,
        totalPrice: totalPrice,
        totalItems: totalItems,
      },
      { new: true }
    );

    return res
      .status(200)
      .send({ status: true, message: "Success", data: updateCart });
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};

///////////////////////////// checkout kart  ///////////////////////////////////////////////////////////
//// old ///
/* 
exports.checkOut = async (req, res) => {
  try {
    const userId = req.user._id;

    let userData = await User.findById(userId);

    if (!userData) {
      return res.status(404).send({ status: false, message: "user not found" });
    }

    const cartSummary = await cartModel.findOne({userId:userId}).populate({
      path: "items.productId",
      select: "title category MRP price weightperKg pieces _id productImg",
      model: Product,
    });
console.log(cartSummary)
if (!cartSummary) {
  return res.status(404).send({ status: false, message: " Cart is Empty" });
}
    let totalMRP = 0;
    for (let i = 0; i < cartSummary.items.length; i++) {
      let sum = cartSummary.items[i].productId.MRP * cartSummary.items[i].quantity;
      totalMRP += sum; 
    }

    totalDiscount = totalMRP - cartSummary.totalPrice;

    let allProducts = [];

    for (let i = 0; i < cartSummary.items.length; i++) {
      let prod = {
        Product_title: cartSummary.items[i].productId.title,
        Product_category: cartSummary.items[i].productId.category,
        Product_price: cartSummary.items[i].productId.price,
        Product_quantity: cartSummary.items[i].quantity,

      };
      if(cartSummary.items[i].productId.weightperKg){
 prod.weight= cartSummary.items[i].productId.weightperKg
      }
      else if(cartSummary.items[i].productId.pieces){
        prod.Pieces= cartSummary.items[i].productId.pieces
             }

      allProducts.push(prod);
    }

// shipping data 


   let cartDetails = {
productsData:[...allProducts],
totalItems:cartSummary.totalItems,
Discount: totalDiscount,
cartId: cartSummary._id
   }
   

   const shipCharge = await Shipping.find();

   if(shipCharge){

if (parseFloat(cartSummary.totalPrice) >= parseFloat(shipCharge[0].freeShipingLimit)) {
let  totalPrice = parseFloat(cartSummary.totalPrice);
  cartDetails.TotalPrice=totalPrice,
 cartDetails.Shipping = "Free"
} else {
let  totalPrice = parseFloat(cartSummary.totalPrice);
  if (!isNaN(parseFloat(shipCharge[0].shippingCharge))) {

   totalPrice = parseFloat(shipCharge[0].shippingCharge)+totalPrice
  cartDetails.TotalPrice = totalPrice
    cartDetails.Shipping =  Number(shipCharge[0].shippingCharge);
  }
}
}

    res
      .status(200)
      .send({ status: true, message: "success", data: cartDetails });
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};
 */

// new  code for check out kart working 

exports.checkOut = async (req, res) => {
  try {
    const userId = req.user._id;

    let userData = await User.findById(userId);

    if (!userData) {
      return res.status(404).send({ status: false, message: "user not found" });
    }

    const cartSummary = await cartModel
      .findOne({ userId: userId })
      .populate({
        path: "items.productId",
        select: "_id title category MRP price weightperKg pieces productImg",
        model: Product,
      });

    if (!cartSummary) {
      return res.status(404).send({ status: false, message: "Cart is Empty" });
    }

    let totalMRP = 0;
    for (let i = 0; i < cartSummary.items.length; i++) {
      let sum = cartSummary.items[i].productId.MRP * cartSummary.items[i].quantity;
      totalMRP += sum;
    }

    totalDiscount = totalMRP - cartSummary.totalPrice;

    let allProducts = [];

    for (let i = 0; i < cartSummary.items.length; i++) {
      let prod = {
        Product_id: cartSummary.items[i].productId._id, // Include the _id field
        Product_title: cartSummary.items[i].productId.title,
        Product_category: cartSummary.items[i].productId.category,
        Product_MRP: cartSummary.items[i].productId.MRP,
        Product_price: cartSummary.items[i].productId.price,
        Product_quantity: cartSummary.items[i].quantity,
        Product_image: cartSummary.items[i].productId.productImg[0].url, // Include the first image URL
      };

      if (cartSummary.items[i].productId.weightperKg) {
        prod.weight = cartSummary.items[i].productId.weightperKg;
      } else if (cartSummary.items[i].productId.pieces) {
        prod.Pieces = cartSummary.items[i].productId.pieces;
      }

      allProducts.push(prod);
      
    }

    // shipping data

    let cartDetails = {
      productsData: [...allProducts],
      totalItems: cartSummary.totalItems,
      Discount: totalDiscount,
      cartId: cartSummary._id,
      userId: cartSummary.userId
    };

    const shipCharge = await Shipping.find();

    if (shipCharge) {
      if (parseFloat(cartSummary.totalPrice) >= parseFloat(shipCharge[0].freeShipingLimit)) {
        let totalPrice = parseFloat(cartSummary.totalPrice);
        cartDetails.TotalPrice = totalPrice;
        cartDetails.Shipping = 0;
      } else {
        let totalPrice = parseFloat(cartSummary.totalPrice);
        if (!isNaN(parseFloat(shipCharge[0].shippingCharge))) {
          totalPrice = parseFloat(shipCharge[0].shippingCharge) + totalPrice;
          cartDetails.TotalPrice = totalPrice;
          cartDetails.Shipping = Number(shipCharge[0].shippingCharge);
        }
      }
    }

    res.status(200).send({ status: true, message: "success", data: cartDetails });
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};




///////////////////////////////// delete cart /////////////////////////////////////////////////////////

exports.deleteCart = async (req, res) => {
  try {
    const userId = req.user._id;
    let userData = await User.findById(userId);
    console.log(userData);
    if (!userData) {
      return res.status(404).send({ status: false, message: "user not found" });
    }

    let cartData = await cartModel.findOne({ userId: userId });
    console.log(cartData);
    if (!cartData) {
      return res.status(404).send({ status: false, message: "Cart Not found" });
    }

    if (cartData.items.length == 0)
      return res
        .status(404)
        .send({ status: false, message: "Cart is empty now" });

    let items = cartData.items;
    while (items.length != 0) {
      for (let i = 0; i < items.length; i++) {
        items.shift(items[i]);
      }
    }

    totalPrice = cartData.totalPrice == 0;
    totalItems = cartData.totalItems == 0;

    const deleteCart = await cartModel.findOneAndUpdate(
      { userId: userId },
      {
        $set: {
          items: cartData.items,
          totalPrice: totalPrice,
          totalItems: totalItems,
        },
      },
      { new: true }
    );

    res.status(200).send({ status: true, message: "Cart has been deleted" });
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};

//////////////////////////////////// get by user  Time Slot for delivery ///////////////////////////////////////////

//  slot will expire before 1 hour of end time 


exports.getTimeSlots = async (req, res) => {
  try {
    const currentTime = moment();
    const endTimeThreshold = moment().add(1, "hour");

    const timeSlots = await TimeSlot.find().sort({ day: -1 });

    // Filter the time slots based on endTime greater than current time + 1 hour

    const filteredTimeSlots = timeSlots.filter((slot) => {
      const slotEndTime = moment(
        slot.day + " " + slot.endTime,
        "dddd (DD MMM) h:mmA"
      );
      return slotEndTime.isAfter(endTimeThreshold);
    });

    res.status(200).json({
      status: true,
      timeSlots: filteredTimeSlots,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      message: "Failed to retrieve time slots",
      error: error.message,
    });
  }
};


