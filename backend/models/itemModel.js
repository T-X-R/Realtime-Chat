const mongoose = require("mongoose");

const itemModel = mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    images: { type: String },
  },
  {
    timestamps: true,
  }
);

const Item = mongoose.model("Item", itemModel);

module.exports = Item;
