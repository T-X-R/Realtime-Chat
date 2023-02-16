const jwt = require("jsonwebtoken");
const User = require("../models/userModel.js");
const asyncHandler = require("express-async-handler");

const authHandler = asyncHandler(async (req, res, next) => {
  let token;

  if (
    // Bearer authentication: extract Bearer + token
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // remove Bearer and take the token
      token = req.headers.authorization.split(" ")[1];

      // decode token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // without password
      req.user = await User.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      res.status(401);
      throw new Error("Fail authorized");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Fail authorized, no token found");
  }
});

module.exports = { authHandler };
