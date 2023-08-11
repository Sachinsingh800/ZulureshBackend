const Order = require("../models/orderModel");
const CustomerDetails = require("../models/userDetails");
const cartModel = require("../models/cartModel")
const Product = require('../models/productModel'); 



exports.paymentByUser = async (req, res) => {
  try {
    const userId = req.params.userId;

    const payments = await Order.find({ userId: userId }).select({
      totalPrice: 1,
    });
    console.log(payments);

    let sum = 0;

    for (let i = 0; i < payments.length; i++) {
      sum += payments[i].totalPrice;
    }

    let newData = await CustomerDetails.findOne({ userObjectId: userId });

    let customerData = {
      userId: newData.customerId,
      userName: newData.name,
      totalAmount: sum,
    };

    console.log(sum);
    res.status(200).json({ stsatus: true, data: customerData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



exports.paymentByOrder = async (req, res) => {
  try {
    const userId = req.params.userId;

    const payments = await Order.find({ userId: userId }).select({
      totalPrice: 1, orderId: 1
    });
    console.log(payments);

    let sum = 0;
let orderIds =[]
    for (let i = 0; i < payments.length; i++) {
      sum += payments[i].totalPrice;
   orderIds.push(payments[i].orderId)
    }
console.log(orderIds)
  

    let newData = await CustomerDetails.findOne({ userObjectId: userId });

    let customerData = {
      orderId:[...orderIds],
      userName: newData.name,
      totalAmount: sum,
    };

    console.log(sum);
    res.status(200).json({ stsatus: true, data: customerData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




//////////////////////////// abandon cart ////////////////////////////////

 
exports.abandonedCart = async (req, res) => {
  try {
    const allAbandonedCarts = await cartModel.find().populate('items.productId');

    const formattedCarts = allAbandonedCarts.map((cart) => {
      const formattedItems = cart.items.map((item) => {
        return {
          productId: item.productId._id,
          quantity: item.quantity,
        };
      });

      return {
        cartId: cart._id,
        _Id: cart.userId,
        items: formattedItems,
        totalPrice: cart.totalPrice,
        totalItems: cart.totalItems,
        userID: cart.userID
      };
    });

   
    for (let i = 0; i < formattedCarts.length; i++) {
      for (let j = 0; j < formattedCarts[i].items.length; j++) {
        const productFields = ['title', 'description', 'pieces', 'MRP', 'price']; 

        const product = await Product.findById(formattedCarts[i].items[j].productId)
          .select(productFields.join(' ')) 
          .lean(); 

        formattedCarts[i].items[j].productId = product;
      }
    }


    res.status(200).json({ status: true, data: formattedCarts });
  } catch (error) {
    res.status(500).json({ status: false, error: error.message });
  }
};
