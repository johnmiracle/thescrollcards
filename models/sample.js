const mongoose = require("mongoose");

const Sampleschema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
});

module.exports = Order = mongoose.model("Sample", Sampleschema);
