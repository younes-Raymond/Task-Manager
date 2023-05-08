const Workers = require('../models/userModel');
const asyncErrorHandler = require('../middlewares/asyncErrorHandler');
const cloudinary = require('cloudinary');
const sendToken = require('../utils/sendToken');



// Register User

exports.registerUser = asyncErrorHandler(async (req, res, next) => {
    try {
      const myCloud = await cloudinary.uploader.upload(req.body.avatar, {
        folder:"avatars",
        width:150,
        crop:"scale"
      });
  
      const { name, email, gender, password } = req.body;
  
      const user = await Workers.create({
        name, 
        email,
        gender,
        password,
        avatar: {
          public_id:myCloud.public_id,
          url:myCloud.secure_url
        },
      });
  
      sendToken(user, 201, res);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server error" });
    }
  });







  

// Login User
exports.loginUser = asyncErrorHandler(async (req, res) => {
  console.log(req.body)
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: 'Please enter email and password' });
    return;
  }

  const user = await Workers.findOne({ email }).select('+password');

  if (!user) {
    res.status(401).json({ message: "Sorry, we couldn't find an account with that email and password" });
    return;
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    res.status(401).json({ message: "Sorry, we couldn't find an account with that email and password" });
    return;
  }

  sendToken(user, 201, res);
});


















// Get All Users --ADMIN
exports.getAllUsers = asyncErrorHandler(async (req, res, next) => {

  const users = await Workers.find();

  res.status(200).json({
      success: true,
      users,
  });
});
