const express = require("express");
const router = express.Router();

const { location } = require("../controllers/locationController");
const {
  getAllProducts,
  signUp,
  verifyOtp,
  bestDeals,
  combos,
  bestSeller,
} = require("../controllers/userController");
const {
  createCart,
  updateKart,
  checkOut,
  deleteCart,
  getTimeSlots,
} = require("../controllers/cartController");
const { authentication } = require("../middi/auth");
const {
  addAddress,
  updateAddress,
  getAllAddresses,
  getSingleAddress,
  deleteAddress,
  setDefaultAddress,
} = require("../controllers/addressController");
const {
  createOrder,
  getOrderDetails,
  getAllOrders,
  getOrderDetailsPdf,
  generateInvoicePDF,
} = require("../controllers/orderController");
const {
  createCustomerData,
  updateCustomer,
  getProfile,
} = require("../controllers/userDetails");
const { promoDeduct } = require("../controllers/couponCtrl");

router.route("/location").post(location);
////////////////////// Products /////////////////////////////

router.route("/products").get(getAllProducts);

router.route("/bestDeals").get(bestDeals);

router.route("/bestSeller").get(bestSeller);

router.route("/combos").get(combos);

/////////////////  cart //////////////////////////////

router.route("/addToCart").post(authentication, createCart);

router.route("/updateCart").put(authentication, updateKart);

router.route("/checkOut").get(authentication, checkOut);

router.route("/deleteCart").delete(authentication, deleteCart);

//////////////// user verification /////////////////

router.route("/signUp").post(signUp);

router.route("/verifiction").post(verifyOtp);

/////////////////// create profile for admin but it will be in user ///////

router.route("/profile").post(authentication, createCustomerData);

router.route("/default/:addressId").put(authentication, updateCustomer);

router.route("/profile").get(authentication, getProfile);

////////////////// user Addresss ////////////////////

router.route("/addAddress").post(authentication, addAddress);

router
  .route("/setDefaultAddress/:addressId")
  .put(authentication, setDefaultAddress);

router.route("/changeAddress/:addressId").put(authentication, updateAddress);

router.route("/AllAddress").get(authentication, getAllAddresses);

router
  .route("/getSingleAddress/:addressId")
  .get(authentication, getSingleAddress);

router.route("/deleteAddress/:addressId").delete(authentication, deleteAddress);

///////////////////////// user time slot /////////////////

router.route("/getTimeSlot").get(getTimeSlots);

// orderModel

router.route("/createOrder/:addressId").post(authentication, createOrder);

router.route("/getOrder/:orderId").get(authentication, getOrderDetails);
router.route("/allOrders").get(authentication, getAllOrders);

// promo discount ///

router.route("/promoDiscount").post(promoDeduct);

///pdf conversion ...dummy

router.route("/getInvoice/:orderId").get(generateInvoicePDF);

module.exports = router;
