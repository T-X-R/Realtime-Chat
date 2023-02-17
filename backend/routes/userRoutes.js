const express = require("express");
const { userRegister, userAuth, allUsers, delUser } = require("../controllers/userController");
const { authHandler } = require("../handler/authHandler")

const router = express.Router();

router.route('/').post(userRegister).get(authHandler, allUsers);
router.post('/login', userAuth);
router.post('/delete', delUser);

module.exports = router;
