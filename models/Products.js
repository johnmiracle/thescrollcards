const mongoose = require("mongoose");

const Productschema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
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

    [-]
  },
  imageUrl: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  inStock: {
    type: Boolean
  },
  created_on: { type: Date, default: Date.now }
});

module.exports = Product = mongoose.model("Product", Productschema);
