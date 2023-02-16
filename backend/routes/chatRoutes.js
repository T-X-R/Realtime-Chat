const express = require("express");
const {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  removeFromGroup,
  addToGroup,
} = require("../controllers/chatController");
const { authHandler } = require("../handler/authHandler");

const router = express.Router();

// if not login, cannot access routes
router.route("/").post(authHandler, accessChat);
router.route("/").get(authHandler, fetchChats);
router.route("/group").post(authHandler, createGroupChat);
router.route("/rename").put(authHandler, renameGroup);
router.route("/groupadd").put(authHandler, addToGroup);
router.route("/groupremove").put(authHandler, removeFromGroup);

module.exports = router;
