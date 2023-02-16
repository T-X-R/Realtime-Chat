const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const generateToken = require("../config/generateToken");

const userRegister = asyncHandler(async (req, res) => {
  const { name, password, pic } = req.body;
  if (!name || !password) {
    res.status(400);
    throw new Error("Missing required fields");
  }

  // check if the user exists
  const ifExists = await User.findOne({ name });
  if (ifExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  // create a new user
  const user = await User.create({
    name,
    password,
    pic,
  });
  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      //   isAdmin: user.isAdmin,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Failed to create a new user");
  }
});

const userAuth = asyncHandler(async (req, res) => {
  const { name, password } = req.body;
  const user = await User.findOne({ name });

  // if user exists
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      // isAdmin: user.isAdmin,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid Username or Password");
  }
});

// search all users except self
const allUsers = asyncHandler(async (req, res) => {
  // Provides regular expression capabilities for pattern matching strings in queries
  const keyword = req.query.search
    ? {
        $or: [{ name: { $regex: req.query.search, $options: "i" } }],
      }
    : {};

  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  res.send(users);
});

module.exports = { userRegister, userAuth, allUsers };
