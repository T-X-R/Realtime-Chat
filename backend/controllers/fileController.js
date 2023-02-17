const asyncHandler = require("express-async-handler");
const File = require("../models/fileModel");
const request = require("request");
const csv = require("csv-parser");
const shuffle = require('shuffle-array');

const fileUpload = asyncHandler(async (req, res) => {
  const { id, uploadFile } = req.body;
  if (!uploadFile) {
    res.status(400);
    throw new Error("Missing upload csv file");
  }

  try {
    const results = [];
    const stream = request.get(uploadFile).pipe(csv({ delimiter: "," }));

    for await (const data of stream) {
      const wrongList = data.wrongAnswers.includes(";")
        ? data.wrongAnswers.split(";")
        : [data.wrongAnswers];
      const ans = [data.correctAnswer];
      ans.push(...wrongList)
      shuffle(ans);
      const file = await File.create({
        owner: id,
        questionId: data.id,
        text: data.text,
        correctAnswer: data.correctAnswer,
        wrongAnswers: wrongList,
        answers: ans,
        level: data.level,
        imgName: data.imgName,
      });

      results.push(file);
    }

    console.log("CSV file successfully processed");
    // console.log(results);
    res.status(200).send(results);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const allFiles = asyncHandler(async (req, res) => {
  try {
    result = await File.find({ owner: req.user._id })
      .sort({ updatedAt: -1 })
      .select("text correctAnswer wrongAnswers answers level");
    // console.log(result);
    res.status(200).send(result);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

module.exports = { fileUpload, allFiles };
