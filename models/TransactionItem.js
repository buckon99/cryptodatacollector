const mongoose = require('mongoose');

const transactionItemSchema = new mongoose.Schema({
    product_id: String,
    trade_id: Number,
    sequence: Number,
    price: String,
    size: String,
    side: String
  }, { timestamps: true });
  const TransactionItem = mongoose.model('TransactionItem', transactionItemSchema);
  
  module.exports = TransactionItem;