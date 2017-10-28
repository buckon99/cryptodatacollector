const mongoose = require('mongoose');

const orderBookItemSchema = new mongoose.Schema({
    product_id: String,
    order_type: String,
    price: Number,
    amount: Number
  }, { timestamps: true });
  const OrderBookItem = mongoose.model('OrderBookItem', orderBookItemSchema);
  
  module.exports = OrderBookItem;