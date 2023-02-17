const asyncHandler = require("express-async-handler");
const Item = require("../models/itemModel");

const imgUpload = asyncHandler(async (req, res) => {
  const { id, uploadPic } = req.body;
  if (!uploadPic) {
    res.status(400);
    throw new Error("Missing upload picture");
  }

  try {
    const item = await Item.create({
      owner: id,
      images: uploadPic,
    });

    res.status(200).send(item);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const allPictures = asyncHandler(async (req, res) => {
  try {
    const result = await Item.find({ owner: req.user._id }).sort({ updatedAt: -1 }).select("images");
    // console.log(result);
    res.status(200).send(result);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

module.exports = { imgUpload, allPictures };
