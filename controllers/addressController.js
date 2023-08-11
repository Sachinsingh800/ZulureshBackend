const UserAddress = require("../models/addressInfo");
const validation = require("../validations/validation");
const Location = require("../models/adminLocation");
const addressInfo = require("../models/addressInfo");

///////////////////////////////////   ADD ADDRESS USER /////////////////////////////////////////////////

exports.addAddress = async (req, res) => {
  try {
    let userId = req.user._id;

    let addressData = req.body;

    let {
      name,
      phoneNo,
      houseFlatNo,
      blockName,
      street,
      landMark,
      pinCode,
      locality,
      saveAddressAs,
      // deliverySlot,
      userID
    } = addressData;

    if (!name) {
      return res
        .status(400)
        .json({ status: false, message: "Please provide your Name" });
    }

    if (!phoneNo) {
      return res
        .status(400)
        .json({ status: false, message: "Please provide your Phone" });
    }
    if (!validation.validateMobileNo(phoneNo)) {
      return res
        .status(400)
        .send({ status: false, message: "Invalid phone number" });
    }

    if (!houseFlatNo) {
      return res
        .status(400)
        .json({ status: false, message: "Please provide house or flat no" });
    }
    if (!validation.flatNoRegex(houseFlatNo)) {
      return res
        .status(400)
        .json({ status: false, message: "Invalid flat number" });
    }

    if (!street) {
      return res
        .status(400)
        .json({ status: false, message: "Please provide your street" });
    }

    if (!validation.streetRegex(street)) {
      return res.status(400).json({ status: false, message: "Invalid street" });
    }

    if (!pinCode) {
      return res
        .status(400)
        .json({ status: false, message: "Please provide your area pincode" });
    }
    const checkPincode = await Location.findOne({ pincode: pinCode });

    if (!checkPincode) {
      return res.status(400).json({
        status: false,
        message: "Sorry curently we are not availble in this pincode area",
      });
    }

    if (!locality) {
      return res
        .status(400)
        .json({ status: false, message: "Please provide your locality" });
    }

    if (!saveAddressAs) {
      return res.status(400).json({
        status: false,
        message: "Please select address as  to save your address",
      });
    }
    if (!["Home", "Work", "Other"].includes(saveAddressAs)) {
   return res.status(400).json({
        status: false,
        message: "select address as Home , Work , Other",
      });
    }

    // frontend will manage this ... need to store time slot in this form "Saturday (03 Jun) 10:00AM - 1:00PM"

// if(!deliverySlot){
//   return res.status(400).json({status:false , message:"Select your Time slot"})
// }
 
// if(deliverySlot){
//   if(!deliverySlot.day){
//     return res.status(400).send({status:false , message:"Invalid slot day"})
//   } else if(!deliverySlot.startTime){
//     return res.status(400).send({status:false , message:"Invalid slot Start Time"})
//   }
//   else if(!deliverySlot.endTime){
//     return res.status(400).send({status:false , message:"Invalid slot End Time"})
//   }
// }

console.log("userId",req.user.userId, req.user._id)
userID = addressData.userID = req.user.userId;
    userId = addressData.userId = req.user._id;
    const saveAddress = await UserAddress.create(addressData);


    const count = await UserAddress.find({ userId:userId });


const countn = count.length;
console.log(countn, "count");

if (countn === 1) {
  const newAddress = await UserAddress.findByIdAndUpdate(
    saveAddress._id,
    { setAsDefault: true },
    { new: true }
  );

  return res.status(201).json({
    status: true,
    message: "Address added successfully",
    data: newAddress,
  });
} else {
  return res.status(201).json({
    status: true,
    message: "Address added successfully",
    data: saveAddress,
  });
  }
 } catch (error) {
    res.status(500).json({
      status: false,
      message: "Failed to add address",
      error: error.message,
    });
  }
};



///////////////////////////////////// set As default /////////////////////

exports.setDefaultAddress = async (req, res) => {
  try {
    const userId = req.user._id;
    const addressId = req.params.addressId; 

    const addressToSetDefault = await UserAddress.findOne({
      _id: addressId,
      userId: userId,
    });

    if (!addressToSetDefault) {
      return res.status(404).json({
        status: false,
        message: "Address not found",
      });
    }

    addressToSetDefault.setAsDefault = true;
    await addressToSetDefault.save();

    await UserAddress.updateMany(
      { userId: userId, _id: { $ne: addressId } },
      { setAsDefault: false }
    );

    res.status(200).json({
      status: true,
      message: "Default address set successfully",
      data: addressToSetDefault,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Failed to set default address",
      error: error.message,
    });
  }
};








/////////////////////////////////////   UPDATE ADDRESS BY USER //////////////////////////////////////////


exports.updateAddress = async (req, res) => {
  try {
    const userId = req.user._id;
    const addressId = req.params.addressId;
    const addressData = req.body;

    let {
      name,
      phoneNo,
      houseFlatNo,
      blockName,
      street,
      landMark,
      pinCode,
      locality,
      saveAddressAs,
      // deliverySlot
    } = addressData;

    if (phoneNo) {
      if (!validation.validateMobileNo(phoneNo)) {
        return res
          .status(400)
          .json({ status: false, message: "Invalid phone number" });
      }
    }

    if (houseFlatNo) {
      if (!validation.flatNoRegex(houseFlatNo)) {
        return res
          .status(400)
          .json({ status: false, message: "Invalid flat number" });
      }
    }

    if (street) {
      if (!validation.streetRegex(street)) {
        return res
          .status(400)
          .json({ status: false, message: "Invalid street" });
      }
    }

    if (pinCode) {
      const checkPincode = await Location.findOne({ pincode: pinCode });

      if (!checkPincode) {
        return res.status(400).json({
          status: false,
          message: "Sorry curently we are not availble in this pincode area",
        });
      }
    }

    if (saveAddressAs) {
      if (!["Home", "Work", "Other"].includes(saveAddressAs)) {
        res.status(400).json({
          status: false,
          message: "select address as Home , Work , Other",
        });
      }
    }
    
    // if(!deliverySlot){
    //   return res.status(400).json({status:false , message:"Select your Time slot"})
    // }
    
    // if(deliverySlot){
    //   if(!deliverySlot.day){
    //     return res.status(400).send({status:false , message:"Invalid slot day"})
    //   } else if(!deliverySlot.startTime){
    //     return res.status(400).send({status:false , message:"Invalid slot Start Time"})
    
    //   }
    //   else if(!deliverySlot.endTime){
    //     return res.status(400).send({status:false , message:"Invalid slot End Time"})
    //   }
    // }

    const updateAddress = await UserAddress.findOneAndUpdate(
      { userId: userId, _id:addressId },
      { ...addressData },{new:true}
    );
    res.status(200).json({
      status: true,
      message: "Address updated ",
      data: updateAddress,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Failed to add address",
      error: error.message,
    });
  }
};

////////////////////////////////////////// Get All Addresss //////////////////////////////////////////

exports.getAllAddresses = async (req, res) => {
  try {
    const userId = req.user._id;

    const addresses = await UserAddress.find({ userId });

    res.status(200).json({ status: true, data: addresses });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Failed to get addresses",
      error: error.message,
    });
  }
};

////////////////////////////////////////// Get Single Addresss //////////////////////////////////////////

exports.getSingleAddress = async (req, res) => {
  try {
    const addressId = req.params.addressId;

    const userId = req.user._id;
    const address = await UserAddress.findOne({
      _id: addressId,
      userId: userId,
    });

    if (!address) {
      return res
        .status(404)
        .json({ status: false, message: "Address not found" });
    }

    res.status(200).json({ status: true, data: address });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Failed to get address",
      error: error.message,
    });
  }
};

////////////////////////////////////////// delete Addresss //////////////////////////////////////////



exports.deleteAddress = async (req, res) => {
  try {
    const addressId = req.params.addressId;
    const userId = req.user._id;

    const deleteAddress = await addressInfo.findOneAndDelete({
      _id: addressId,
      userId: userId,
    },{new:true});

res.status(200).json({status:false , message:"address removed"})

  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};




  




