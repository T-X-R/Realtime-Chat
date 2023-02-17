const express = require("express");
const {
  imgUpload,
  allPictures,
} = require("../controllers/itemController");
const { authHandler } = require("../handler/authHandler");

const router = express.Router();

router.route("/").get(authHandler, allPictures);
router.route("/uploadimg").post(imgUpload);

module.exports = router;
