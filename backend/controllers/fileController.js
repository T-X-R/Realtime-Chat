const asyncHandler = require("express-async-handler");
const File = require("../models/fileModel");
const request = require("request");
const csv = require("csv-parser");

const fileUpload = asyncHandler(async (req, res) => {
  const { id, uploadFile } = req.body;
  if (!uploadFile) {
    res.status(400);
    throw new Error("Missing upload csv file");
  }

  try {
    const results = [];
    request
      .get(uploadFile)
      .pipe(
        csv({
          delimiter: ",",
        })
      )
      .on("data", async (data) => {
        results.push(data);
        const wrongList = data.wrongAnswers.split(";");
        const file = await File.create({
          owner: id,
          text: data.text,
          correctAnswer: data.correctAnswer,
          wrongAnswers: wrongList,
          level: data.level,
          imgName: data.imgName,
        });
        // console.log(results);
      })
      .on("end", () => {
        console.log("CSV file successfully processed");
      });

      res.status(200).send(results);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const allFiles = asyncHandler(async (req, res) => {
  //   try {
  //     result = await Item.find({ owner: req.user._id }).sort({ updatedAt: -1 }).select("images");
  //     // console.log(result);
  //     res.status(200).send(result);
  //   } catch (error) {
  //     res.status(400);
  //     throw new Error(error.message);
  //   }
});

module.exports = { fileUpload, allFiles };
