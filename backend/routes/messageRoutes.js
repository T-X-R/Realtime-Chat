const express = require("express");
const { sendMessage, allMessages } = require("../controllers/messageController");
const { authHandler } = require("../handler/authHandler")

const router = express.Router();

router.route('/').post(authHandler, sendMessage);
router.route('/:chatId').get(authHandler, allMessages);

module.exports = router;
