const Workers = require('../models/userModel');
const asyncErrorHandler = require('../middlewares/asyncErrorHandler');
const cloudinary = require('cloudinary');
const sendToken = require('../utils/sendToken');
const MaterialRequest = require('../models/MaterialRequestModel');



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





  const checkMaterialRequests = async (userId) => {
    try {
      const materialRequests = await MaterialRequest.find({
        $or: [
          { materialId: userId },
          { requesterId: userId },
          { userId_of_Taken: userId },
        ],
      });
  
      let requestData = {
        pending: [],
        approved: [],
        rejected: [],
        taken: false,
      };
  
      materialRequests.forEach(request => {
        if (request.requesterId.toString() === userId.toString()) {
          if (request.status === 'pending') {
            const pendingRequest = {
              message: ' the request is pending ',
              materialId: request.materialId,
              requesterName: request.requesterName,
              requesterAvatar: request.requesterAvatar,
              destination: request.requesterDestination,
              materialPicture: request.materialPicture,
              requesterId: request.requesterId,
              userOfTaken: request.userId_of_Taken,
              requestId: request._id
            };
            if (request.requesterAvatar) {
              pendingRequest.requesterAvatar = request.requesterAvatar;
            }
            if (request.requesterDestination) {
              pendingRequest.destination = request.requesterDestination;
            }
            requestData.pending.push(pendingRequest);
          } else if (request.status === 'approved') {
            requestData.approved.push({
              message: ' the request is approved',
              materialId: request.materialId,
              requesterName: request.requesterName,
              requesterAvatar: request.requesterAvatar,
              destination: request.requesterDestination,
              materialPicture: request.materialPicture,
              userOfTaken: request.userId_of_Taken,
              requesterId: request.requesterId,
              requestId: request._id
            });
          } else if (request.status === 'rejected') {
            requestData.rejected.push({
              message: ' the request is regected ',
              materialId: request.materialId,
              requesterName: request.requesterName,
              requesterAvatar: request.requesterAvatar,
              destination: request.requesterDestination,
              materialPicture: request.materialPicture,
              requesterId: request.requesterId,
              userOfTaken: request.userId_of_Taken,
              requestId: request._id
            });
          }
        } else if (request.userId_of_Taken.toString() === userId.toString()) {
          requestData.taken = true;
        }
      });
  
      return requestData;
    } catch (error) {
      console.log('Error:', error.message);
      return 'An error occurred while checking material requests.';
    }
  };



  exports.loginUser = asyncErrorHandler(async (req, res) => {
    console.log(req.body);
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
    
    const requestData = {
      user: {
        _id: user._id,
        name: user.name,
        avatar: user.avatar,
      },
    };
    const message = await checkMaterialRequests(user._id);
    // console.log('message:', message);
    if (message) {
      if (message.pending.length > 0 || message.rejected.length > 0) {
        const materialRequest = await MaterialRequest.findOne({ requesterId: user._id, status: 'pending' });
        if (materialRequest) {
          requestData.message = message.pending.length > 0 ? 'Your request is pending. Please wait for approval.' : 'Your request has been rejected. Please try again later.';
          requestData.materialId = materialRequest.materialId;
          requestData.requesterName = materialRequest.requesterName;
          requestData.requesterAvatar = materialRequest.requesterAvatar;
          requestData.destination = materialRequest.requesterDestination;
          requestData.materialPicture = materialRequest.materialPicture;
          requestData.userId_of_Taken = materialRequest.userId_of_Taken
          requestData.requesterId = materialRequest.requesterId;
          requestData.requestId = materialRequest._id;
        }
      } else if (message.approved.length > 0) {
        requestData.message = 'Your material request has been approved.';
      }
    }
    console.log('im request data before send it to Bom',requestData)
    const token = user.generateToken();
    res.status(200).json({ token, requestData , user});
  });




// Get All Users --ADMIN
exports.getAllUsers = asyncErrorHandler(async (req, res, next) => {

  const users = await Workers.find();

  res.status(200).json({
      success: true,
      users,
  });
});
