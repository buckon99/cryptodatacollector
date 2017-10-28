/*MAIN PROGRAM FOR CRYPTODATACOLLECTOR*/
var WebSocket  = require('ws');
const mongoose = require('mongoose');
var ws = new WebSocket('wss://ws-feed.gdax.com');
const OrderBookItem = require('./models/OrderBookItem');

mongoose.connection.on('error', (err) => {
  console.error(err);
  console.log('%s MongoDB connection error. Please make sure MongoDB is running.');
  process.exit();
});

mongoose.connect('mongodb://localhost/cryptodata');
ws.on('open', function() {
    var data = {
        "type": "subscribe",
        "product_ids": [
            "ETH-USD"
        ],
        "channels": [
            /*"full",*/
            "level2"
        ]
    };
    ws.send(JSON.stringify(data));
});
ws.on('message', function(message) {
    var json = JSON.parse(message);
    if(json.type == "snapshot"){
        OrderBookItem.remove({}, function(err){
            if(err)
                console.log("Error clearing all order book items: " + err);
            json.bids.forEach(function(entry){
                var item = new OrderBookItem({
                    product_id: json.product_id,
                    order_type: "buy",
                    price: entry[0],
                    amount: entry[1]
                });
                item.save((err) => {
                    if (err) { return next(err); }
                });
            });
            json.asks.forEach(function(entry){
                var item = new OrderBookItem({
                    product_id: json.product_id,
                    order_type: "sell",
                    price: entry[0],
                    amount: entry[1]
                });
                item.save((err) => {
                    if (err) { return next(err); }
                });
            });
        });
    }
    else if(json.type == "l2update"){
        json.changes.forEach(function(entry){
            if(entry[2] == "0")
            {
                OrderBookItem.remove({product_id: json.product_id, order_type: entry[0], price: entry[1]}, function(err){
                    if(err)
                        console.log("error deleting order book item: " + err);
                });
            }else{
                OrderBookItem.findOne({product_id: json.product_id, order_type: entry[0], price: entry[1]}, function(error, result) {
                    if(result == null){
                        var item = new OrderBookItem({
                            product_id: json.product_id,
                            order_type: entry[0],
                            price: entry[1],
                            amount: entry[2]
                        });
                        item.save((err) => {
                            if (err) { return next(err); }
                        });
                    }else{
                        result.amount = entry[2];
                        result.save((err) => {
                            if (err) { return next(err); }
                        });
                    }
                });
            }
        });
    }
});