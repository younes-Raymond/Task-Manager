const Workers = require('../models/userModel');
const asyncErrorHandler = require('../middlewares/asyncErrorHandler');
const cloudinary = require('cloudinary');
const sendToken = require('../utils/sendToken');
const MaterialRequest = require('../models/MaterialRequestModel');
const { connect } = require('mongoose');



// Register User

exports.registerUser = asyncErrorHandler(async (req, res, next) => {
  console.log(req.body)
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
  
    const requestData = {
      user: {
        _id: user._id,
        name: user.name,
        avatar: user.avatar,
      },
    };
  
    const materialRequests = await MaterialRequest.find({
      $or: [
        { materialId: user._id },
        { requesterId: user._id },
        { userId_of_Taken: user._id },
      ],
    }).populate('userId_of_Taken');
  
    let pendingRequests = [];
    let approvedRequests = [];
    let rejectedRequests = [];
    let taken = false;
  
    materialRequests.forEach((request) => {
      if (request.requesterId.toString() === user._id.toString()) {
        if (request.status === 'pending') {
          const pendingRequest = {
            message: 'Your request is pending. Please wait for approval.',
            materialId: request.materialId,
            requesterName: request.requesterName,
            requesterAvatar: request.requesterAvatar,
            destination: request.requesterDestination,
            materialPicture: request.materialPicture,
            requesterId: request.requesterId,
            userOfTaken: request.userId_of_Taken,
            requestId: request._id,
          };
          pendingRequests.push(pendingRequest);
        } else if (request.status === 'approved') {
          const approvedRequest = {
            message: 'Your material request has been approved.',
            materialId: request.materialId,
            requesterName: request.requesterName,
            requesterAvatar: request.requesterAvatar,
            destination: request.requesterDestination,
            materialPicture: request.materialPicture,
            userOfTaken: request.userId_of_Taken,
            requesterId: request.requesterId,
            requestId: request._id,
          };
          approvedRequests.push(approvedRequest);
        } else if (request.status === 'rejected') {
          const rejectedRequest = {
            message: 'Your request has been rejected. Please try again later.',
            materialId: request.materialId,
            requesterName: request.requesterName,
            requesterAvatar: request.requesterAvatar,
            destination: request.requesterDestination,
            materialPicture: request.materialPicture,
            requesterId: request.requesterId,
            userOfTaken: request.userId_of_Taken,
            requestId: request._id,
          };
          rejectedRequests.push(rejectedRequest);
        }
      } else if (request.userId_of_Taken.toString() === user._id.toString()) {
        taken = true;
        const takenRequest = {
          message: 'You have a material that a requester needs. Please approve or reject the request.',
          materialId: request.materialId,
          requesterName: request.requesterName,
          requesterAvatar: request.requesterAvatar,
          destination: request.requesterDestination,
          materialPicture: request.materialPicture,
          requesterId: request.requesterId,
          requestId: request._id,
          requestDate: request.requestDate,
          status: request.status,
          requesterName: request.requesterName,
          requesterAvatar: request.requesterAvatar,
          requesterDestination: request.requesterDestination,
          materialPicture: request.materialPicture,
          __v: request.__v,
          userOfTaken: request.userId_of_Taken,
          userOfTakenData: request.userId_of_Taken,
        };
        requestData.takenRequest = takenRequest;
      }
    });
  
    if (pendingRequests.length > 0) {
      requestData.pendingRequests = pendingRequests;
    }
  
    if (approvedRequests.length > 0) {
      requestData.approvedRequests = approvedRequests;
    }
  
    if (rejectedRequests.length > 0) {
      requestData.rejectedRequests = rejectedRequests;
    }
  
    if (taken) {
      requestData.taken = true;
    }
  
    const token = user.generateToken();
    res.status(200).json({ token, requestData });
  });



// Get All Users --ADMIN
exports.getAllUsers = asyncErrorHandler(async (req, res, next) => {

  const users = await Workers.find();

  res.status(200).json({
      success: true,
      users,
  });
});
