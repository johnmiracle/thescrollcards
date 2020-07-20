const mongoose = require("mongoose");

const Orderschema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  orderPaymentId: {
    type: String,
    require: true
  },
  orderPaymentGateway: {
    type: String,
    require: true
  },
  orderProducts: {
    type: Object,
    required: true
  },
  orderFirstName: {
    type: String,
    require: true
  },
  orderLastName: {
    type: String,
    require: true
  },
  orderAddress: {
    type: String,
    required: true
  },
  orderEmail: {
    type: String,
    required: true
  },
  orderCountry: {
    type: String,
    required: true
  },
  orderState: {
    type: String,
    required: true
  },
  orderPostcode: {
    type: String,
    required: true
  },
  orderTotal: {
    type: Number,
    format: "amount"
  },
  orderPhone: Number,
  orderStatus: {
    type: String,
    default: "Failed"
  },
  orderGatewayResponse: {
    type: String,
    default: "Failed"
  },
  orderComment: {
    type: String
  },
  orderDate: {
    type: Date,
    default: Date.now
  }
});

module.exports = Order = mongoose.model("Order", Orderschema);
