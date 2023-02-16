const express = require("express");
const { userRegister, userAuth, allUsers } = require("../controllers/userController");
const { authHandler } = require("../handler/authHandler")

const router = express.Router();

router.route('/').post(userRegister).get(authHandler, allUsers);
router.post('/login', userAuth);

module.exports = router;
