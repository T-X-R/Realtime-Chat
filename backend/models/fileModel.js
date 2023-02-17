const mongoose = require("mongoose");

const fileModel = mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    text: { type: String },
    correctAnswer: { type: String },
    wrongAnswers: [{ type: String }],
    level: { type: String },
    imgName: { type: String },
  },
  {
    timestamps: true,
  }
);

const File = mongoose.model("File", fileModel);

module.exports = File;
