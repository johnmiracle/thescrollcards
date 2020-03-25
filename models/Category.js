const mongoose = require("mongoose");
const User = require("../models/User");

const Categoryschema = new mongoose.Schema({
  name: {
    type: String,
    required: "Please input category name",
    unique: true
  },
  description: {
    type: String,
    required: "Please fill the description"
  },
  author: {
    type: mongoose.Schema.ObjectId,
    ref: User
  },
  created_on: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Category", Categoryschema);
