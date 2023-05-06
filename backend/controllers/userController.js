const UserTaken = require('../models/userModel');
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
  
      const user = await UserTaken.create({
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
exports.loginUser = asyncErrorHandler(async (req, res, next) => {
    console.log(req.body)

    // const { email, password } = req.body;

    // if(!email || !password) {
    //     return next(new ErrorHandler("Please Enter Email And Password", 400));
    // }

    // const user = await User.findOne({ email}).select("+password");

    // if(!user) {
    //     return next(new ErrorHandler("Invalid Email or Password", 401));
    // }

    // const isPasswordMatched = await user.comparePassword(password);

    // if(!isPasswordMatched) {
    //     return next(new ErrorHandler("Invalid Email or Password", 401));
    // }

    // sendToken(user, 201, res);
});

