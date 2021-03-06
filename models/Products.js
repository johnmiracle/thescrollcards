const mongoose = require("mongoose");

const Productschema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  code: {
    type: String,
    required: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  size: {
    type: String,
    required: true
  },
  material: {
    type: String,
    required: true
  },
  materialDescription: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  color: {
    type: String
  },
  description: {
    type: String,
    required: true
  },
  inStock: {
    type: String,
    required: true
  },
  created_on: { type: Date, default: Date.now }
});

module.exports = Product = mongoose.model("Product", Productschema);
