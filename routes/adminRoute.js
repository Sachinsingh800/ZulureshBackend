const express = require("express");
const {
  adminPincode,
  updateTimeSlot,
  allTimeSlotWithId,
  deleteSingleTimeSlot,
  deleteAllTimeSlots,
  allPincode,
  deletePincode,
} = require("../controllers/locationController");
const {
  ProductData,
  allProducts,
  singleProduct,
  updateProduct,
  deleteProduct,
  shippingChargeAdmin,
  deleteShippingChargeAdmin,
  gettShippingCharge,
} = require("../controllers/productConroller");
const { timeSlot } = require("../controllers/locationController");
const {
  getAllOrdersAdmin,
  getparticularOrderData,
  updateOrderAdmin,
} = require("../controllers/orderController");
const {
  getAllUserProfiles,
  getSingleUserProfile,
  updateUserProfileAdmin,
  exportUserProfilesToExcel,
} = require("../controllers/userDetails");
const {
  paymentByUser,
  paymentByOrder,
  abandonedCart,
} = require("../controllers/paymentController");
const {
  createCategory,
  updateCategory,
  getAllCategory,
  getSingleCategory,
  deleteSingleCategory,
  createSubCategory,
  updateSubCategory,
  getAllSubCategories,
  getSingleSubCategory,
  deleteAllSubCategories,
  deleteSingleSubCategory,
} = require("../controllers/categoryAndSubCategoryContro");
const {
  createCoupon,
  updateCoupon,
  getCoupon,
  deleteCoupon,
  getAllCoupon,
} = require("../controllers/couponCtrl");
const { createBanner, getAllBanner, deleteSingleBanner } = require("../controllers/bannerCtrl");

const router = express.Router();

//////////pincode by admin ////////

router.route("/createPincode").post(adminPincode);
router.route("/getAllPincode").get(allPincode);
router.route("/deletePincode/:id").delete(deletePincode);

//================= product add ===================

router.route("/add/product").post(ProductData);
router.route("/get/allproduct").get(allProducts);
router.route("/get/product/:Id").get(singleProduct);

router.route("/update/product/:id").put(updateProduct);
router.route("/delete/product/:Id").delete(deleteProduct);

//  timeslot

router.route("/addTimeSlot").post(timeSlot);
//====== for sumit ....===========
// router.route("/getTimeSlot").get(getTimeSlots)
//======= for admin =======
router.route("/allSlots").get(allTimeSlotWithId);
//======
router.route("/updateTimeSlot/:slotId").put(updateTimeSlot);

router.route("/deleteTimeSlot/:slotId").delete(deleteSingleTimeSlot);

router.route("/deleteAllTimeSlots").delete(deleteAllTimeSlots);

//// shipping charge ////

router.route("/shippingCharge").post(shippingChargeAdmin);
router.route("/delete/shipping/:shippingId").delete(deleteShippingChargeAdmin);

router.route("/getShipping").get(gettShippingCharge);

//====================== admin order section =========

router.route("/getAllOrders").get(getAllOrdersAdmin);

router.route("/getSingleOrder/:orderId").get(getparticularOrderData);
router.route("/updateOrder/:orderId").put(updateOrderAdmin);

/////////// get all profile customer //////////

router.route("/allProfile").get(getAllUserProfiles);

router.route("/getSingleProfile/:profileId").get(getSingleUserProfile);

router.route("/updateSingleProfile/:profileId").put(updateUserProfileAdmin);

router.route("/exportsProfiledata").get(exportUserProfilesToExcel);

////// payment info /////////

router.route("/paymentByUser/:userId").get(paymentByUser);
router.route("/paymentByOrder/:userId").get(paymentByOrder);

//  abandoned cart for admin /////

router.route("/abandonCart").get(abandonedCart);

////// Category by admin ///////

router.route("/addCategory").post(createCategory);
router.route("/updateCategory/:catId").put(updateCategory);
router.route("/getSingleCategory/:catId").get(getSingleCategory);
router.route("/getAllCategory").get(getAllCategory);
router.route("/deleteSingleCategory/:catId").delete(deleteSingleCategory);

///////////////////// sub Category /////////////////

router.route("/addSubCategory/:catId").post(createSubCategory);
router.route("/updateSubCategory/:catId/:subCatId").put(updateSubCategory);
router.route("/getAllCategory/:catId").get(getAllSubCategories);
router.route("/getSingleSubCategory/:subCatId").get(getSingleSubCategory);
// delete All Sub Categories of a Category //
router.route("/deleteAllSubCategory/:catId").delete(deleteAllSubCategories);
router
  .route("/deleteSingleSubCategory/:subCatId")
  .delete(deleteSingleSubCategory);

///////////////////////////////// Coupon /////////////////////////////

router.route("/addCoupon").post(createCoupon);
router.route("/updateCoupon/:id").put(updateCoupon);
router.route("/getAllCoupon").get(getAllCoupon);
router.route("/getCoupon/:id").get(getCoupon);
router.route("/deleteCoupon/:id").delete(deleteCoupon);



//////////////////// Banner /////////

router.route("/createBanner").post(createBanner)

router.route("/getAllBanner").get(getAllBanner)

router.route("/deleteSingleBanner/:bannerId").delete(deleteSingleBanner)


module.exports = router;
