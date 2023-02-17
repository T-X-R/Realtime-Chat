const express = require("express");
const { allFiles, fileUpload } = require("../controllers/fileController");

const { authHandler } = require("../handler/authHandler");

const router = express.Router();

router.route("/").get(authHandler, allFiles);
router.route("/uploadfile").post(fileUpload);

module.exports = router;
