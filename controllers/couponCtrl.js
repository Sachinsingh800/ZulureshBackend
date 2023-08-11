const Coupon = require("../models/couponModel");

exports.createCoupon = async (req, res) => {
  try {
    const data = req.body;
    const { promoCode, discount, expiry } = data;


    if (!promoCode || !discount || !expiry) {
      return res.status(400).json({ status: false, message: "All fields are required" });
    }

    // Check if the coupon promoCode already exists
    const existingCoupon = await Coupon.findOne({ promoCode });
    if (existingCoupon) {
      return res.status(400).json({ status: false, message: "Coupon promoCode must be unique" });
    }

    const newCoupon = await Coupon.create(data);
    res.status(201).json({ status: true, data: newCoupon });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

exports.updateCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const { promoCode, discount, expiry } = data;


    if (!promoCode && !discount && !expiry) {
      return res.status(400).json({ status: false, message: "at least one fields should be there to update" });
    }

    // if the coupon promoCode already exists 
    const existingCoupon = await Coupon.findOne({ promoCode, _id: { $ne: id } });
    if (existingCoupon) {
      return res.status(400).json({ status: false, message: "Coupon promoCode must be unique" });
    }

    // Find and update the coupon
    const updatedCoupon = await Coupon.findByIdAndUpdate(id, data, { new: true });
    if (!updatedCoupon) {
      return res.status(404).json({ status: false, message: "Coupon not found" });
    }

    res.json({ status: true, data: updatedCoupon });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

exports.getAllCoupon = async (req, res) => {
  try {


    // Find the coupon by ID
    const coupon = await Coupon.find();
    if (coupon.length==0) {
      return res.status(404).json({ status: false, message: "Coupon not found" });
    }

    res.json({ status: true, data: coupon });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

exports.getCoupon = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the coupon by ID
    const coupon = await Coupon.findById(id);
    if (!coupon) {
      return res.status(404).json({ status: false, message: "Coupon not found" });
    }

    res.json({ status: true, data: coupon });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

exports.deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;

    
    const deletedCoupon = await Coupon.findByIdAndDelete(id);
    if (!deletedCoupon) {
      return res.status(404).json({ status: false, message: "Coupon not found" });
    }

    res.json({ status: true, data: deletedCoupon });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};



//// promo code for total price deduction //////


exports.promoDeduct = async (req,res)=>{
  try{
// data = res.body 
// let {totalPrice} = data

let amountAfterDiscount = parseFloat(req.body.totalPrice)

if (req.body.promoCode) {
  const coupon = await Coupon.findOne({ promoCode:req.body.promoCode });

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
  const discountAmount =  parseFloat(( parseFloat(amountAfterDiscount) * discountPercentage) / 100);
  amountAfterDiscount -= discountAmount;
  // console.log("totalPicePromo", amountAfterDiscount);
}

res.status(200).json({status:true , message:"price after promo", data:amountAfterDiscount})

  }catch(err){
    res.status(500).json({status:false , message:err.message})
  }
}


