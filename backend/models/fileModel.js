const mongoose = require("mongoose");

const fileModel = mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    // questions: { type: Array, default: []},
    questionId: { type: String },
    text: { type: String },
    correctAnswer: { type: String },
    wrongAnswers: { type: Array },
    answers: { type: Array },
    level: { type: String },
    imgName: { type: String },
  },
  {
    timestamps: true,
  }
);

const File = mongoose.model("File", fileModel);

module.exports = File;
