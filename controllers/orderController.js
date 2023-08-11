const Order = require("../models/orderModel");
const addressInfo = require("../models/addressInfo");
const Product = require("../models/productModel");
const cartModel = require("../models/cartModel");
const Shipping = require("../models/delivereyChargeModel");
const Coupon = require("../models/couponModel");
/////////////////////////////////// create order //////////////////////////////////////////
/* 
old
exports.createOrder = async (req, res) => {
  try {
    const addressId = req.params.addressId;
    let userId = req.user._id;
    const data = req.body;
    let { shippingInfo, paymentInfo, id, status, shippingPrice, userID } = data;

    const addressData = await addressInfo
      .findById(addressId)
      .select({ _id: 0, __v: 0, createdAt: 0, updatedAt: 0 });

    if (!addressData) {
      return res
        .status(404)
        .json({ status: false, message: "Address not found" });
    }

    const name = addressData.name;

    data.shippingInfo = {};
    data.shippingInfo.name = name;
    data.shippingInfo.phoneNo = addressData.phoneNo;
    data.shippingInfo.houseFlatNo = addressData.houseFlatNo;

    if (addressData.blockName) {
      data.shippingInfo.blockName = addressData.blockName;
    }
    data.shippingInfo.street = addressData.street;

    if (addressData.landMark) {
      data.shippingInfo.landMark = addressData.landMark;
    }
    data.shippingInfo.pinCode = addressData.pinCode;
    data.shippingInfo.locality = addressData.locality;
    data.shippingInfo.saveAddressAs = addressData.saveAddressAs;
    data.shippingInfo.deliverySlot = {
      day: addressData.deliverySlot.day,
      startTime: addressData.deliverySlot.startTime,
      endTime: addressData.deliverySlot.endTime,
    };

    const cartProduct = await cartModel.findOne({ userId: userId });

    if (cartProduct.items.length == 0) {
      return res.status(400).send({
        status: false,
        message:
          "Can't place an order with an empty cart. Add your products to the cart.",
      });
    }

    const items = cartProduct.items.map((cartItem) => ({
      productId: cartItem.productId,
      quantity: cartItem.quantity,
    }));

    data.items = items;

    let totalPrice = null;

    const shipCharge = await Shipping.find();

    if (
      parseFloat(cartProduct.totalPrice) >=
      parseFloat(shipCharge[0].freeShipingLimit)
    ) {
      totalPrice = parseFloat(cartProduct.totalPrice);
      shippingPrice = data.shippingPrice = 0;
    } else {
      totalPrice = parseFloat(cartProduct.totalPrice);
      if (!isNaN(parseFloat(shipCharge[0].shippingCharge))) {
        totalPrice += parseFloat(shipCharge[0].shippingCharge);
        shippingPrice = data.shippingPrice = Number(
          shipCharge[0].shippingCharge
        );
      }
    }
    const totalItems = cartProduct.totalItems;

    data.totalPrice = totalPrice;
    data.totalItems = totalItems;
// paid At
    if (data.paymentMethod.online == true) {
      const timestamp = Date.now();
      const dateObj = new Date(timestamp);
      data.paidAt = dateObj.toLocaleString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true
      });
    }
    if (data.paymentMethod.online == true) {
if(!(data.paymentInfo.id && data.paymentInfo.status)){
return res.status(400).json({status:false ,message:"Please provide Payment id and staus if you are paying online"})
}

    }



    const orderData = await Order.find()

    let orderId = data.orderId = `ORD000${orderData.length +1}`
     userID = data.userID = req.user.userId
    userId = data.userId = req.user._id;

    const savedOrder = await Order.create(data);

    await cartModel.findOneAndUpdate(
      { userId: userId },
      { $set: { items: [], totalPrice: 0, totalItems: 0 } },
      { new: true }
    );


    res.status(201).json({
      status: true,
      message: "Order created successfully",
      data: savedOrder,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Failed to create order",
      error: error.message,
    });
  }
};

 */
// new

/* exports.createOrder = async (req, res) => {
  try {
    const addressId = req.params.addressId;
    const userId = req.user._id;
    const data = req.body;
    let { shippingInfo, paymentInfo, id, status, shippingPrice, userID,deliverySlot} = data;

    const addressData = await addressInfo.findById(addressId).select({
      _id: 0,
      __v: 0,
      createdAt: 0,
      updatedAt: 0,
    });

    if (!addressData) {
      return res.status(404).json({ status: false, message: "Address not found" });
    }
////////////////////// deliveryslot  //////////////////
    if(!deliverySlot){
  return res.status(400).json({status:false , message:"Select your Time slot"})
}

if(deliverySlot){
  if(!deliverySlot.day){
    return res.status(400).send({status:false , message:"Invalid slot day"})
  } else if(!deliverySlot.startTime){
    return res.status(400).send({status:false , message:"Invalid slot Start Time"})
  }
  else if(!deliverySlot.endTime){
    return res.status(400).send({status:false , message:"Invalid slot End Time"})
  }
}



//////////////////////////////////////////////////////

    const name = addressData.name;

    data.shippingInfo = {
      name: name,
      phoneNo: addressData.phoneNo,
      houseFlatNo: addressData.houseFlatNo,
      blockName: addressData.blockName || "",
      street: addressData.street,
      landMark: addressData.landMark || "",
      pinCode: addressData.pinCode,
      locality: addressData.locality,
      saveAddressAs: addressData.saveAddressAs,
      deliverySlot: {
        day: addressData.deliverySlot.day,
        startTime: addressData.deliverySlot.startTime,
        endTime: addressData.deliverySlot.endTime,
      },
    };






    const cartProduct = await cartModel.findOne({ userId: userId });

    if (cartProduct.items.length == 0) {
      return res.status(400).send({
        status: false,
        message: "Can't place an order with an empty cart. Add your products to the cart.",
      });
    }

    const items = cartProduct.items.map((cartItem) => ({
      productId: cartItem.productId,
      quantity: cartItem.quantity,
    }));

    data.items = items;

    let totalPrice = null;

    const shipCharge = await Shipping.find();

    if (parseFloat(cartProduct.totalPrice) >= parseFloat(shipCharge[0].freeShipingLimit)) {
      totalPrice = parseFloat(cartProduct.totalPrice);
      shippingPrice = data.shippingPrice = 0;
    } else {
      totalPrice = parseFloat(cartProduct.totalPrice);
      if (!isNaN(parseFloat(shipCharge[0].shippingCharge))) {
        totalPrice += parseFloat(shipCharge[0].shippingCharge);
        shippingPrice = data.shippingPrice = Number(shipCharge[0].shippingCharge);
      }
    }

    const totalItems = cartProduct.totalItems;

    data.totalItems = totalItems;

    // Apply coupon code if provided
    if (req.body.promoCode) {
      const coupon = await Coupon.findOne({ promoCode:req.body.promoCode});

      if (!coupon) {
        return res.status(404).json({ status: false, message: "Invalid coupon code" });
      }

      if (coupon.expiry < Date.now()) {
        return res.status(400).json({ status: false, message: "Coupon code has expired" });
      }

      const discountPercentage = parseFloat(coupon.discount);
      const discountAmount = (totalPrice * discountPercentage) / 100;
      totalPrice -= discountAmount;
    }
console.log(totalPrice)
data.totalPrice = totalPrice;

    // Set paidAt timestamp
    if (data.paymentMethod.online == true) {
      const timestamp = Date.now();
      const dateObj = new Date(timestamp);
      data.paidAt = dateObj.toLocaleString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      });
    }

    // Validate payment information for online payment
    if (data.paymentMethod.online == true) {
      if (!(data.paymentInfo.id && data.paymentInfo.status)) {
        return res
          .status(400)
          .json({ status: false, message: "Please provide Payment id and status if you are paying online" });
      }
    }

    const orderData = await Order.find();
    const orderId = data.orderId = `ORD000${orderData.length + 1}`;
    data.userID = req.user.userId;
    data.userId = req.user._id;

    const savedOrder = await Order.create(data);

    await cartModel.findOneAndUpdate(
      { userId: userId },
      { $set: { items: [], totalPrice: 0, totalItems: 0 } },
      { new: true }
    );

    res.status(201).json({
      status: true,
      message: "Order created successfully",
      data: savedOrder,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Failed to create order",
      error: error.message,
    });
  }
};
 */

//// new +new
/* 
exports.createOrder = async (req, res) => {
  try {
    const addressId = req.params.addressId;
    const userId = req.user._id;
    const data = req.body;
    let {
      shippingInfo,
      paymentInfo,
      id,
      status,
      shippingPrice,
      userID,
      deliverySlot,
    } = data;

    const addressData = await addressInfo.findById(addressId).select({
      _id: 0,
      __v: 0,
      createdAt: 0,
      updatedAt: 0,
    });

    if (!addressData) {
      return res
        .status(404)
        .json({ status: false, message: "Address not found" });
    }

    ////////////////////// deliveryslot  //////////////////
    if (
      !deliverySlot ||
      !deliverySlot.day ||
      !deliverySlot.startTime ||
      !deliverySlot.endTime
    ) {
      return res
        .status(400)
        .json({ status: false, message: "Invalid delivery slot data" });
    }
    //////////////////////////////////////////////////////

    const name = addressData.name;

    shippingInfo = {
      name: name,
      phoneNo: addressData.phoneNo,
      houseFlatNo: addressData.houseFlatNo,
      blockName: addressData.blockName || "",
      street: addressData.street,
      landMark: addressData.landMark || "",
      pinCode: addressData.pinCode,
      locality: addressData.locality,
      saveAddressAs: addressData.saveAddressAs,
      deliverySlot: {
        day: deliverySlot.day,
        startTime: deliverySlot.startTime,
        endTime: deliverySlot.endTime,
      },
    };

    const cartProduct = await cartModel.findOne({ userId: userId });

    if (cartProduct.items.length === 0) {
      return res.status(400).json({
        status: false,
        message:
          "Can't place an order with an empty cart. Add your products to the cart.",
      });
    }

    const items = cartProduct.items.map((cartItem) => ({
      productId: cartItem.productId,
      quantity: cartItem.quantity,
    }));

    data.shippingInfo = shippingInfo;
    data.items = items;

    let totalPrice = null;

    const shipCharge = await Shipping.find();

    if (
      parseFloat(cartProduct.totalPrice) >=
      parseFloat(shipCharge[0].freeShipingLimit)
    ) {
      totalPrice = parseFloat(cartProduct.totalPrice);
      shippingPrice = data.shippingPrice = 0;
    } else {
      totalPrice = parseFloat(cartProduct.totalPrice);
      if (!isNaN(parseFloat(shipCharge[0].shippingCharge))) {
        totalPrice += parseFloat(shipCharge[0].shippingCharge);
        shippingPrice = data.shippingPrice = Number(
          shipCharge[0].shippingCharge
        );
      }
    }

    const totalItems = cartProduct.totalItems;

    data.totalItems = totalItems;
    console.log("totalPriceshiip", totalPrice);
    // Apply coupon code if provided
    if (req.body.promoCode) {
      const coupon = await Coupon.findOne({ promoCode: req.body.promoCode });

      if (!coupon) {
        return res
          .status(404)
          .json({ status: false, message: "Invalid coupon code" });
      }

      if (coupon.expiry < Date.now()) {
        return res
          .status(400)
          .json({ status: false, message: "Coupon code has expired" });
      }

      const discountPercentage = parseFloat(coupon.discount);
      const discountAmount = (totalPrice * discountPercentage) / 100;
      totalPrice -= discountAmount;
      console.log("totalPicePromo", totalPrice);
    }
    console.log("totalPicePromo", totalPrice);
    data.totalPrice = totalPrice;

    // Set paidAt timestamp
    if (data.paymentMethod.online === true) {
      const timestamp = Date.now();
      const dateObj = new Date(timestamp);
      data.paidAt = dateObj.toLocaleString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      });
    }

    // Validate payment information for online payment
    if (data.paymentMethod.online === true) {
      if (!(data.paymentInfo.id && data.paymentInfo.status)) {
        return res
          .status(400)
          .json({
            status: false,
            message:
              "Please provide Payment id and status if you are paying online",
          });
      }
    }

    const orderData = await Order.find();
    const orderId = (data.orderId = `ORD000${orderData.length + 1}`);
    data.userID = req.user.userId;
    data.userId = req.user._id;

    const savedOrder = await Order.create(data);

    await cartModel.findOneAndUpdate(
      { userId: userId },
      { $set: { items: [], totalPrice: 0, totalItems: 0 } },
      { new: true }
    );

    res.status(201).json({
      status: true,
      message: "Order created successfully",
      data: savedOrder,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Failed to create order",
      error: error.message,
    });
  }
};
 */
///////////////////////////// All Ok Create Order   //////////////

exports.createOrder = async (req, res) => {
  try {
    const addressId = req.params.addressId;
    const userId = req.user._id;
    const data = req.body;
    let {
      shippingInfo,
      paymentInfo,
      id,
      status,
      shippingPrice,
      userID,
      deliverySlot,
    } = data;

    const addressData = await addressInfo.findById(addressId).select({
      _id: 0,
      __v: 0,
      createdAt: 0,
      updatedAt: 0,
    });

    if (!addressData) {
      return res
        .status(404)
        .json({ status: false, message: "Address not found" });
    }

    ////////////////////// deliveryslot  //////////////////
    if (
      !deliverySlot ||
      !deliverySlot.day ||
      !deliverySlot.startTime ||
      !deliverySlot.endTime
    ) {
      return res
        .status(400)
        .json({ status: false, message: "Invalid delivery slot data" });
    }
    //////////////////////////////////////////////////////

    const name = addressData.name;

    shippingInfo = {
      name: name,
      phoneNo: addressData.phoneNo,
      houseFlatNo: addressData.houseFlatNo,
      blockName: addressData.blockName || "",
      street: addressData.street,
      landMark: addressData.landMark || "",
      pinCode: addressData.pinCode,
      locality: addressData.locality,
      saveAddressAs: addressData.saveAddressAs,
      deliverySlot: {
        day: deliverySlot.day,
        startTime: deliverySlot.startTime,
        endTime: deliverySlot.endTime,
      },
    };

    const cartProduct = await cartModel.findOne({ userId: userId });

    if (cartProduct.items.length === 0) {
      return res.status(400).json({
        status: false,
        message:
          "Can't place an order with an empty cart. Add your products to the cart.",
      });
    }

    const items = cartProduct.items.map((cartItem) => ({
      productId: cartItem.productId,
      quantity: cartItem.quantity,
    }));

    data.shippingInfo = shippingInfo;
    data.items = items;

 //////////  Apply coupon code if provided for that  //////////////

let totalPrice = parseFloat(cartProduct.totalPrice)

 if (req.body.promoCode) {
  const coupon = await Coupon.findOne({ promoCode: req.body.promoCode });

  if (!coupon) {
    return res
      .status(404)
      .json({ status: false, message: "Invalid coupon code" });
  }

  if (coupon.expiry < Date.now()) {
    return res
      .status(400)
      .json({ status: false, message: "Coupon code has expired" });
  }

  const discountPercentage = parseFloat(coupon.discount);
  const discountAmount =  parseFloat(( parseFloat(cartProduct.totalPrice) * discountPercentage) / 100);
  totalPrice -= discountAmount;
  console.log("totalPicePromo", totalPrice);
}
console.log("totalPicePromo", totalPrice);

data.totalPrice = totalPrice;

/////////////// Shipping Charge /////////////////////

    let shipping = 0;

    const shipCharge = await Shipping.find();

    if (
      parseFloat(cartProduct.totalPrice) >=
      parseFloat(shipCharge[0].freeShipingLimit)
    ) {
      shipping = 0
      shippingPrice = data.shippingPrice = 0;
    } else {
      shipping = parseFloat(cartProduct.totalPrice);
      if (!isNaN(parseFloat(shipCharge[0].shippingCharge))) {
        shipping = parseFloat(shipCharge[0].shippingCharge);
        shippingPrice = data.shippingPrice = Number(
          shipCharge[0].shippingCharge
        );
      }
    }

    const totalItems = cartProduct.totalItems;

    data.totalItems = totalItems;
   
    data.totalPrice = parseFloat(totalPrice + shipping)

    // Set paidAt timestamp
    if (data.paymentMethod.online === true) {
      const timestamp = Date.now();
      const dateObj = new Date(timestamp);
      data.paidAt = dateObj.toLocaleString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      });
    }

    // Validate payment information for online payment
    if (data.paymentMethod.online === true) {
      if (!(data.paymentInfo.id && data.paymentInfo.status)) {
        return res
          .status(400)
          .json({
            status: false,
            message:
              "Please provide Payment id and status if you are paying online",
          });
      }
    }

    const orderData = await Order.find();
    const orderId = (data.orderId = `ORD000${orderData.length + 1}`);
    data.userID = req.user.userId;
    data.userId = req.user._id;

    const savedOrder = await Order.create(data);

    await cartModel.findOneAndUpdate(
      { userId: userId },
      { $set: { items: [], totalPrice: 0, totalItems: 0 } },
      { new: true }
    );

    res.status(201).json({
      status: true,
      message: "Order created successfully",
      data: savedOrder,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Failed to create order",
      error: error.message,
    });
  }
};

////////////////////////////// get Single order Details user /////////////////////////////////////////////

exports.getOrderDetails = async (req, res) => {
  try {
    let orderId = req.params.orderId;
    let userId = req.user._id;

    const orderData = await Order.findById(orderId).populate({
      path: "items.productId",
      select: "title category MRP price productImg weightperKg pieces",
      model: Product,
    });
    console.log(orderData);
    let totalMRP = 0;
    for (let i = 0; i < orderData.items.length; i++) {
      let sum = orderData.items[i].productId.MRP * orderData.items[i].quantity;
      totalMRP += sum;
    }

    totalDiscount = totalMRP - orderData.totalPrice;

    let allProducts = [];

    for (let i = 0; i < orderData.items.length; i++) {
      let prod = {
        Product_id:orderData.items[i].productId._id,
        Product_title: orderData.items[i].productId.title,
        Product_category: orderData.items[i].productId.category,
        ProductImg: orderData.items[i].productId.productImg[0].url,
        Product_MRP:orderData.items[i].productId.MRP,
        Product_price: orderData.items[i].productId.price,
        Product_quantity: orderData.items[i].quantity,
      };


      if (orderData.items[i].productId.weightperKg) {
        prod.weight = orderData.items[i].productId.weightperKg;
      } else if (orderData.items[i].productId.pieces) {
        prod.Pieces = orderData.items[i].productId.pieces;
      }

      allProducts.push(prod);
    }
    const OrderDetails = {
      address: {
        name: orderData.shippingInfo.name,
        phone: orderData.shippingInfo.phoneNo,
        houseNo: orderData.shippingInfo.houseFlatNo,
        block: orderData.shippingInfo.blockName,
        street: orderData.shippingInfo.street,
        Landmark: orderData.shippingInfo.landMark,
        pincode: orderData.shippingInfo.pinCode,
        locality: orderData.shippingInfo.locality,
        AddressAs: orderData.shippingInfo.saveAddressAs,
        deliverySlot: `${orderData.shippingInfo.deliverySlot.day},${orderData.shippingInfo.deliverySlot.startTime} - ${orderData.shippingInfo.deliverySlot.endTime}`,
      },
      ProductDetails: [...allProducts],
      totalPrice: orderData.totalPrice,
      Discount: totalDiscount,
      orderId: orderData.orderId,
      PaymentInfo: orderData.paymentInfo,
      PaymentMethod:orderData.paymentMethod,
      Order_Status: orderData.orderStatus,
    };


    // if (orderData.paymentMethod.cod == true) {
    //   OrderDetails.Payment_Method = "Cash ON Delivery";
    // } else if (orderData.paymentMethod.online == true) {
    //   OrderDetails.Payment_Method = "Online";
    // }



    if (orderData.paidAt) {
      OrderDetails.PaidAt = orderData.paidAt;
    }

    if (orderData.shippingPrice == 0) {
      OrderDetails.Shipping = 0;
    } else {
      OrderDetails.Shipping = orderData.shippingPrice;
    }
    res.status(200).json({ status: true, orderData: OrderDetails });
  } catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }
};

////////////////////////////////   get All orders Histroy user  //////////////////////////////////////////

exports.getAllOrders = async (req, res) => {
  try {
    let userId = req.user._id;
    const orderData = await Order.find({ userId: userId });

    if (orderData.length == 0) {
      return res
        .status(404)
        .json({ status: false, message: "no order found " });
    }

    res.status(200).send({ status: true, message: "success", data: orderData });
  } catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }
};

//======================================= ~ admin Order section ~ =====================================

//////////////////////////////////////// get all orders  ADMIN ///////////////////////////////////////////

exports.getAllOrdersAdmin = async (req, res) => {
  try{
  let allOrder = await Order.find();

  res.status(200).json({ status: true, data: allOrder });
  }catch(err){
    res.status(500).json({status:false , messsage:err.message})
  }
};

/////////////////////////////////////////// get particular order by Admin ////////////////////////////////////////

exports.getparticularOrderData = async (req, res) => {
  try {
    let orderId = req.params.orderId;
    const orderData = await Order.findById(orderId).populate({
      path: "items.productId",
      select: "title category MRP price weightperKg pieces",
      model: Product,
    });

    let totalMRP = 0;
    for (let i = 0; i < orderData.items.length; i++) {
      let sum = orderData.items[i].productId.MRP * orderData.items[i].quantity;
      totalMRP += sum;
    }

    totalDiscount = totalMRP - orderData.totalPrice;

    let allProducts = [];

    for (let i = 0; i < orderData.items.length; i++) {
      let prod = {
        Product_title: orderData.items[i].productId.title,
        Product_category: orderData.items[i].productId.category,
        Product_price: orderData.items[i].productId.price,
        Product_quantity: orderData.items[i].quantity,
      };
      if (orderData.items[i].productId.weightperKg) {
        prod.weight = orderData.items[i].productId.weightperKg;
      } else if (orderData.items[i].productId.pieces) {
        prod.Pieces = orderData.items[i].productId.pieces;
      }

      allProducts.push(prod);
    }
    const OrderDetails = {
      address: {
        name: orderData.shippingInfo.name,
        phone: orderData.shippingInfo.phoneNo,
        houseNo: orderData.shippingInfo.houseFlatNo,
        block: orderData.shippingInfo.blockName,
        street: orderData.shippingInfo.street,
        Landmark: orderData.shippingInfo.landMark,
        pincode: orderData.shippingInfo.pinCode,
        locality: orderData.shippingInfo.locality,
        AddressAs: orderData.shippingInfo.saveAddressAs,
        deliverySlot: `${orderData.shippingInfo.deliverySlot.day},${orderData.shippingInfo.deliverySlot.startTime} - ${orderData.shippingInfo.deliverySlot.endTime}`,
      },
      ProductDetails: [...allProducts],
      totalPrice: orderData.totalPrice,
      Discount: totalDiscount,
      orderId: orderData.orderId,
      PaymentInfo: orderData.paymentInfo,

      Order_Status: orderData.orderStatus,
      _id: orderData._id,
    };
    if (orderData.paymentMethod.cod == true) {
      OrderDetails.Payment_Method = "COD";
    } else if (orderData.paymentMethod.online == true) {
      OrderDetails.Payment_Method = "Online";
    }
    if (orderData.paidAt) {
      OrderDetails.PaidAt = orderData.paidAt;
    }
    if (orderData.shippingPrice == 0) {
      OrderDetails.Shipping = "free";
    } else {
      OrderDetails.Shipping = orderData.shippingPrice;
    }
    if (orderData.deliveredAt) {
      OrderDetails.Deliverd_Date_And_Time = orderData.deliveredAt;
    }
    res.status(200).json({ status: true, orderData: OrderDetails });
  } catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }
};

/////////////////////////////////////////// update order by Admin ////

exports.updateOrderAdmin = async (req, res) => {
  let orderId = req.params.orderId;
  let data = req.body;

  if (data.orderStatus == "Delivered") {
    const dateObj = new Date();
    data.deliveredAt = dateObj.toLocaleString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  }

  const updatedData = await Order.findOneAndUpdate(
    { _id: orderId },
    { ...data },
    { new: true }
  );

  res
    .status(200)
    .json({ status: true, message: "updated order", data: updatedData });
};

/// pdf formet ....

const pdfmake = require("pdfmake");
const { createReadStream } = require("fs");
const { promisify } = require("util");

exports.generateInvoicePDF = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const orderData = await Order.findById(orderId).populate({
      path: "items.productId",
      select: "title category MRP price weightperKg pieces",
      model: Product,
    });

    let totalMRP = 0;
    for (let i = 0; i < orderData.items.length; i++) {
      let sum = orderData.items[i].productId.MRP * orderData.items[i].quantity;
      totalMRP += sum;
    }

    const totalDiscount = totalMRP - orderData.totalPrice;

    let allProducts = [];

    for (let i = 0; i < orderData.items.length; i++) {
      let prod = {
        Product_title: orderData.items[i].productId.title,
        Product_category: orderData.items[i].productId.category,
        Product_MRP: orderData.items[i].productId.MRP,
        Product_price: orderData.items[i].productId.price,
        Product_quantity: orderData.items[i].quantity,
      };
      if (orderData.items[i].productId.weightperKg) {
        prod.weight = orderData.items[i].productId.weightperKg;
      } else if (orderData.items[i].productId.pieces) {
        prod.Pieces = orderData.items[i].productId.pieces;
      }

      allProducts.push(prod);
    }

    const address = {
      name: orderData.shippingInfo.name,
      phone: orderData.shippingInfo.phoneNo,
      houseNo: orderData.shippingInfo.houseFlatNo,
      block: orderData.shippingInfo.blockName,
      street: orderData.shippingInfo.street,
      Landmark: orderData.shippingInfo.landMark,
      pincode: orderData.shippingInfo.pinCode,
      locality: orderData.shippingInfo.locality,
      AddressAs: orderData.shippingInfo.saveAddressAs,
      deliverySlot: `${orderData.shippingInfo.deliverySlot.day}, ${orderData.shippingInfo.deliverySlot.startTime} - ${orderData.shippingInfo.deliverySlot.endTime}`,
    };

    const paymentInfo = {
      id: orderData.paymentInfo.id,
      status: orderData.paymentInfo.status,
    };

    const fonts = {
      Roboto: {
        normal:
          "C:/Users/lenovo/OneDrive/Desktop/ApnaProduct/publicStore/roboto/Roboto-Regular.ttf",
        bold: "C:/Users/lenovo/OneDrive/Desktop/ApnaProduct/publicStore/roboto/Roboto-Bold.ttf",
        italics:
          "C:/Users/lenovo/OneDrive/Desktop/ApnaProduct/publicStore/roboto/Roboto-CondensedItalic.ttf",
        bolditalics:
          "C:/Users/lenovo/OneDrive/Desktop/ApnaProduct/publicStore/roboto/Roboto-BoldCondensedItalic.ttf",
      },
    };

    const invoiceContent = {
      content: [
        { text: "Invoice", style: "header" },
        { text: "Order Details", style: "subheader" },
        {
          columns: [
            { text: `Order ID: ${orderData.orderId}` },
            { text: `Status: ${orderData.orderStatus}` },
          ],
        },
        { text: "Address", style: "subheader" },
        {
          ul: [
            `Name: ${address.name}`,
            `Phone: ${address.phone}`,
            `House No: ${address.houseNo}`,
            `Block: ${address.block}`,
            `Street: ${address.street}`,
            `Landmark: ${address.Landmark}`,
            `Pincode: ${address.pincode}`,
            `Locality: ${address.locality}`,
            `Address As: ${address.AddressAs}`,
            `Delivery Slot: ${address.deliverySlot}`,
          ],
        },
        { text: "Product Details", style: "subheader" },
        {
          table: {
            headerRows: 1,
            widths: ["*", "*", "*", "*", "*"],
            body: [
              ["Title", "Category", "MRP", "Price", "Quantity"],
              ...allProducts.map((product) => [
                product.Product_title,
                product.Product_category,
                product.Product_MRP,
                product.Product_price,
                product.Product_quantity,
              ]),
            ],
          },
        },
        { text: "Order Summary", style: "subheader" },
        {
          ul: [
            `Total Price: ${orderData.totalPrice}`,
            `Discount: ${totalDiscount}`,
            `Payment Method: ${orderData.paymentMethod.cod ? "COD" : "Online"}`,
            `Shipping: ${
              orderData.shippingPrice === 0 ? "Free" : orderData.shippingPrice
            }`,
          ],
        },
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10],
        },
        subheader: {
          fontSize: 14,
          bold: true,
          margin: [0, 10, 0, 5],
        },
      },
      defaultStyle: {
        font: "Roboto",
        fontSize: 12,
      },
      fonts: fonts,
    };

    const printer = new pdfmake(fonts);
    const pdfDoc = printer.createPdfKitDocument(invoiceContent);

    const chunks = [];
    pdfDoc.on("data", (chunk) => {
      chunks.push(chunk);
    });
    pdfDoc.on("end", () => {
      const result = Buffer.concat(chunks);
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", "attachment; filename=invoice.pdf");
      res.send(result);
    });

    pdfDoc.end();
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// const pdfmake = require('pdfmake');
// const { createReadStream } = require('fs');
// const { promisify } = require('util');

// exports.generateInvoicePDF = async (req, res) => {
//   try {
//     const orderId = req.params.orderId;
//     const orderData = await Order.findById(orderId).populate({
//       path: 'items.productId',
//       select: 'title category MRP price weightperKg pieces',
//       model: Product,
//     });

//     let totalMRP = 0;
//     for (let i = 0; i < orderData.items.length; i++) {
//       let sum = orderData.items[i].productId.MRP * orderData.items[i].quantity;
//       totalMRP += sum;
//     }

//     const allProducts = orderData.items.map((item) => {
//       return {
//         Title: item.productId.title,
//         Category: item.productId.category,
//         MRP: item.productId.MRP,
//         Price: item.productId.price,
//         Quantity: item.productId.pieces || item.productId.weightperKg,
//       };
//     });

//     const address = {
//       name: orderData.shippingInfo.name,
//       phone: orderData.shippingInfo.phoneNo,
//       houseNo: orderData.shippingInfo.houseFlatNo,
//       block: orderData.shippingInfo.blockName,
//       street: orderData.shippingInfo.street,
//       Landmark: orderData.shippingInfo.landMark,
//       pincode: orderData.shippingInfo.pinCode,
//       locality: orderData.shippingInfo.locality,
//       AddressAs: orderData.shippingInfo.saveAddressAs,
//       deliverySlot: `${orderData.shippingInfo.deliverySlot.day}, ${orderData.shippingInfo.deliverySlot.startTime} - ${orderData.shippingInfo.deliverySlot.endTime}`,
//     };

//     const fonts = {
//       Roboto: {
//         normal: 'C:/Users/lenovo/OneDrive/Desktop/ApnaProduct/publicStore/roboto/Roboto-Regular.ttf',
//         bold: 'C:/Users/lenovo/OneDrive/Desktop/ApnaProduct/publicStore/roboto/Roboto-Bold.ttf',
//         italics: 'C:/Users/lenovo/OneDrive/Desktop/ApnaProduct/publicStore/roboto/Roboto-CondensedItalic.ttf',
//         bolditalics: 'C:/Users/lenovo/OneDrive/Desktop/ApnaProduct/publicStore/roboto/Roboto-BoldCondensedItalic.ttf',
//       },
//     };
//     const invoiceContent = {
//       header: {
//         text: 'Invoice',
//         style: 'header',
//         alignment: 'center',
//         margin: [0, 20, 0, 10],
//       },
//       content: [
//         {
//           columns: [
//             {
//               text: 'Billing To:',
//               bold: true,
//             },
//             {
//               text: 'Shipping To:',
//               bold: true,
//               marginLeft: 200,
//             },
//           ],
//         },
//         {
//           columns: [
//             {
//               text: `Name: ${address.name}\nPhone: ${address.phone}\nAddress: ${address.houseNo}, ${address.block}, ${address.street}, ${address.Landmark}, ${address.pincode}, ${address.locality}`,
//               width: '50%',
//             },
//             {
//               text: `Name: ${address.name}\nPhone: ${address.phone}\nAddress: ${address.houseNo}, ${address.block}, ${address.street}, ${address.Landmark}, ${address.pincode}, ${address.locality}`,
//               width: '50%',
//               marginLeft: 200,
//             },
//           ],
//         },
//         {
//           text: `Order ID: ${orderData.orderId}\nOrder Date: ${orderData.createdAt.toDateString()}`,
//         },
//         {
//           text: `Total MRP: ${totalMRP}`,
//         },
//         {
//           text: `Total Price: ${orderData.totalPrice}`,
//         },
//         {
//           text: `Discount: ${totalMRP - orderData.totalPrice}`,
//         },
//         {
//           text: 'Items',
//           style: 'subheader',
//         },
//         {
//           style: 'tableExample',
//           table: {
//             headerRows: 1,
//             widths: ['*', 'auto', 'auto', 'auto', 'auto'],
//             body: [
//               ['Title', 'Category', 'MRP', 'Price', 'Quantity'],
//               ...allProducts.map((product) => [
//                 product.Title,
//                 product.Category,
//                 product.MRP,
//                 product.Price,
//                 product.Quantity,
//               ]),
//             ],
//           },
//         },
//       ],
//       styles: {
//         header: {
//           fontSize: 16,
//           bold: true,
//           margin: [0, 0, 0, 10],
//         },
//         subheader: {
//           fontSize: 14,
//           bold: true,
//           margin: [0, 10, 0, 5],
//         },
//         tableExample: {
//           margin: [0, 5, 0, 15],
//         },
//       },
//     };

//     const printer = new pdfmake(fonts);
//     const pdfDoc = printer.createPdfKitDocument(invoiceContent);
//     pdfDoc.pipe(res);
//     pdfDoc.end();
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: 'Failed to generate invoice PDF' });
//   }
// };
