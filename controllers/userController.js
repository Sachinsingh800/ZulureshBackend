
const User = require('../models/userModel');
const Product = require("../models/productModel")
//================================================ otp and verify otp and token genration ==============
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const otpGenerator = require("otp-generator");
const Otp = require("../models/otpModel");
const validation = require("../validations/validation");
const twilio = require("twilio");
const cartModel = require("../models/cartModel");
const { Types } = require('mongoose')

///////////////////////////////////////// SIGN UP //////////////////////////////////////////////////////////

//========================================== 1 ==============================

/////////////////////////////////////////////////// signUp /////////////////////////////

exports.signUp = async (req, res) => {

  try {
  const OTP = otpGenerator.generate(4, {
    digits: true,
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });

  const number = req.body.number;
  console.log(OTP);

  if (!validation.validateMobileNo(number)) {
    return res
      .status(400)
      .send({ status: false, message: "Invalid phone number" });
  }
//======================== twilio (MY AUTH , SID AND VERIFIED PHONE USED) ==============

// const client = twilio(process.env.TWILIO_ACCOUNT_SID,
//    process.env.TWILIO_AUTH_TOKEN);
//     const message = await client.messages.create({
//       body: `Your OTP for registration is ${OTP}`, 
//       from: process.env.TWILIO_PHONE_NUMBER,
//       to:"+91"+ number,
//     });
//     console.log(message);

//==========================================

  const otp = { number: number, otp: OTP };

  const salt = await bcrypt.genSalt(10);

  otp.otp = await bcrypt.hash(otp.otp, salt);

  const result = await Otp.create(otp);
  let allUser = await User.find()
let userId = req.body.userId = `0000${allUser.length+1}`

let user = await User.findOne({ number: req.body.number });

  if (!user) {
    user = await User.create({ number: req.body.number,userId:userId });
  }

  res.status(200).send({otp:OTP, message:"Otp send sucessfully!"});
}catch (error) {
  console.error(error);
  res.status(500).send({ status: false, message: "Failed to send OTP" });
}
};

//////////////////////////////////////// VERIFYING STUDENT BY OTP //////////////////////////////////////

/* 
exports.verifyOtp = async (req, res) => {
  const otpHolder = await Otp.find({ number: req.body.number });
  if (otpHolder.length === 0)
    return res
      .status(400)
      .send({ status: false, message: "You used an expired OTP or the number is invalid!" });

  const rightOtpFind = otpHolder[otpHolder.length - 1];

  const validUser = await bcrypt.compare(req.body.otp, rightOtpFind.otp);
  if (rightOtpFind.number === req.body.number && validUser) {

    let user = await User.findOne({ number: req.body.number });
console.log(user.userId)
    const token = jwt.sign(
      {
        userId:user.userId,
        _id: user._id,
        number: user.number,
      }, 
      process.env.JWT_SECRET_KEY,
    );

    await Otp.deleteMany({ number: req.body.number });



//================== cart added================================

const checkCart = await cartModel.findOne({userId:user._id})

//if user doesn't have cart ( creating cart for user )
let cartId;
if(!checkCart){

let data = req.body
console.log(user)
let userId = data.userId = user._id
let userID = data.userID = user.userId
let itemsList = kart.items

items = data.items = [...itemsList]

totalPrice = data.totalPrice = kart.totalPrice
totalItems = data.totalItems = kart.totalItems

let addCart = await cartModel.create(data)
cartId = addCart._id.toString()
//================ if user is log out and user already has cart alrady added some product in that.... need to ask ....  cart for that =================

}
if (checkCart) {
  if (checkCart.items.length === 0) {
    let itemsList = kart.items;
    let items = [...itemsList];
    let totalPrice = kart.totalPrice; 
    let totalItems = kart.totalItems;

    await cartModel.findOneAndUpdate(
      { userId: user._id },
      { $set: { items:items, totalPrice:totalPrice, totalItems:totalItems } },
      { new: true }
    );
  } else {
    checkCart.items.forEach(item2 => {
      const foundItem = kart.items.find(item1 => new Types.ObjectId(item1.productId).equals(item2.productId));
      if (foundItem) {
        foundItem.quantity += item2.quantity;
      } else {
        kart.items.push(item2);
      }
    });
    
    kart.totalPrice += checkCart.totalPrice;
    kart.totalItems = kart.items.length;
    console.log(kart)

    let itemsList = kart.items;
    let items = [...itemsList];
    let totalPrice = kart.totalPrice;
    let totalItems = kart.totalItems;


 let updatedCart =  await cartModel.findOneAndUpdate(
      { userId: user._id },
      { $set: { items:items, totalPrice:totalPrice, totalItems:totalItems } },
      { new: true }
    );
    console.log(updatedCart)
  }
}

// ================================================

    return res.status(200).send({
      status: true,
      message: "User verified successfully!",
      token: token,
      data: user,
      cartId:cartId
    });
  } else {
    return res
      .status(400)
      .send({ status: false, message: "Your OTP was wrong!"});
}
};
 
 */

// it is solving the issue of duplicate key index 

/* 
exports.verifyOtp = async (req, res) => {
  try {
    const otpHolder = await Otp.find({ number: req.body.number });

    if (otpHolder.length === 0) {
      return res.status(400).send({
        status: false,
        message: "You used an expired OTP or the number is invalid!"
      });
    }

    const rightOtpFind = otpHolder[otpHolder.length - 1];

    const validUser = await bcrypt.compare(req.body.otp, rightOtpFind.otp);

    if (rightOtpFind.number === req.body.number && validUser) {
      let user = await User.findOne({ number: req.body.number });

      const token = jwt.sign(
        {
          userId: user.userId,
          _id: user._id,
          number: user.number
        },
        process.env.JWT_SECRET_KEY
      );

      await Otp.deleteMany({ number: req.body.number });

//////////////////////////////////////////////////////////


      let cartId;
      let cart = await cartModel.findOne({ userId: user._id });

      if (!cart) {
        // Creating cart for the user
        const data = {
          userId: user._id,
          userID: user.userId,
          items: [],
          totalPrice: 0,
          totalItems: 0
        };

        const itemsList = kart.items;

        if (itemsList.length > 0) {
          data.items = itemsList;
          data.totalPrice = kart.totalPrice;
          data.totalItems = kart.totalItems;
        }

        const addCart = await cartModel.create(data);
        cartId = addCart._id.toString();
      } else {
        // Update the existing cart
        const itemsList = cart.items;

        if (kart.items.length > 0) {
          kart.items.forEach(item => {
            const foundItem = itemsList.find(
              cartItem => cartItem.productId.toString() === item.productId
            );

            if (foundItem) {
              foundItem.quantity += item.quantity;
            } else {
              itemsList.push(item);
            }
          });

          cart.totalPrice += kart.totalPrice;
          cart.totalItems = itemsList.length;

          await cart.save();
        }
      }
 
 

/////////////////////////////////////////////////////////

      return res.status(200).send({
        status: true,
        message: "User verified successfully!",
        token: token,
        data: user,
        // cartId: cartId
      });
    } else {
      return res.status(400).send({ status: false, message: "Your OTP was wrong!" });
    }
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

*/


// 3rd verification 

exports.verifyOtp = async (req, res) => {
  try {
    const otpHolder = await Otp.find({ number: req.body.number });

    if (otpHolder.length === 0) {
      return res.status(400).send({
        status: false,
        message: "You used an expired OTP or the number is invalid!"
      });
    }

    const rightOtpFind = otpHolder[otpHolder.length - 1];

    const validUser = await bcrypt.compare(req.body.otp, rightOtpFind.otp);

    if (rightOtpFind.number === req.body.number && validUser) {
      let user = await User.findOne({ number: req.body.number });

      const token = jwt.sign(
        {
          userId: user.userId,
          _id: user._id,
          number: user.number
        },
        process.env.JWT_SECRET_KEY
      );

      await Otp.deleteMany({ number: req.body.number });

      let cartId;
      let cart = await cartModel.findOne({ userId: user._id });

      // Create cart data based on the request body
      const cartData = {
        items: req.body.items,
        totalPrice: req.body.totalPrice,
        totalItems: req.body.totalItems
      };

      if (!cart) {
        // Creating cart for the user
        const data = {
          userId: user._id,
          userID: user.userId,
          items: cartData.items,
          totalPrice: cartData.totalPrice,
          totalItems: cartData.totalItems
        };

        const addCart = await cartModel.create(data);
        cartId = addCart._id.toString();
      } else {
        // Update the existing cart
        const itemsList = cart.items;

        if (cartData.items.length > 0) {
          cartData.items.forEach(item => {
            const foundItem = itemsList.find(
              cartItem => cartItem.productId.toString() === item.productId
            );

            if (foundItem) {
              foundItem.quantity += item.quantity;
            } else {
              itemsList.push(item);
            }
          });

          cart.totalPrice += cartData.totalPrice;
          cart.totalItems = itemsList.length;

          await cart.save();
        }
      }

      return res.status(200).send({
        status: true,
        message: "User verified successfully!",
        token: token,
        data: user,
        cartId: cartId
      });
    } else {
      return res.status(400).send({ status: false, message: "Your OTP was wrong!" });
    }
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};





////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//======================= get product by category and sub category ===========================






































exports.getAllProducts = async (req, res)=>{
  try {
    let filter = req.query

    let filterdProduct = await Product.find({...filter})

    if(filterdProduct.length==0){

return res.status(404).send({status:false, message:"No Product found"})

    }
res.status(200).send({stats:true , data:filterdProduct})

}catch(err){
    res.status(500).send({ status: false, message: err.message });
  }
};

//==========================================================


/////////////////////////////////// get best deals //////////////


exports.bestDeals = async (req, res)=>{
  try {
    

    let filterdProduct = await Product.find({setAs:"Best Deals"})

    if(filterdProduct.length==0){

return res.status(404).send({status:false, message:"No Product found"})

    }
res.status(200).send({stats:true , data:filterdProduct})

}catch(err){
    res.status(500).send({ status: false, message: err.message });
  }
};



///////////////////////// best Seller /////////


exports.bestSeller = async (req, res)=>{
  try {

 let filterdProduct = await Product.find({setAs:"Best Seller"})

    if(filterdProduct.length==0){

return res.status(404).send({status:false, message:"No Product found"})

    }
res.status(200).send({stats:true , data:filterdProduct})

}catch(err){
    res.status(500).send({ status: false, message: err.message });
  }
};

////////////////////// Combos ////////////

exports.combos = async (req, res)=>{
  try {
  

    let filterdProduct = await Product.find({setAs:"Combos"})

    if(filterdProduct.length==0){

return res.status(404).send({status:false, message:"No Product found"})

    }
res.status(200).send({stats:true , data:filterdProduct})

}catch(err){
    res.status(500).send({ status: false, message: err.message });
  }
};



