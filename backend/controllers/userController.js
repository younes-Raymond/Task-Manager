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
    // console.log(req.body)
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
        gender:user.gender,
        avatar: user.avatar,
        role: user.role,
        email: user.email,
      },
      message: '', 
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
      // console.log('userId_of_Taken:', request.userId_of_Taken);
// console.log('user._id:', user._id);
// console.log('Comparison result:', request.userId_of_Taken._id.toString() === user._id.toString());

      if (request.requesterId.toString() === user._id.toString()) {
        // console.log(' the guy who login requester  and this his id: ', request.requesterId);
        if (request.status === 'pending') {
          requestData.message =  'Your request is pending. Please wait for approval.';
          const pendingRequest = {
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
          requestData.message = 'Your material request has been approved.';
          const approvedRequest = {
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
        requestData.message =  'Your request has been rejected. Please try again later.';
          const rejectedRequest = {
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
      } else if (request.userId_of_Taken._id.toString() === user._id.toString()) {
        // console.log('The user who logged in is userId_of_Taken and this is their ID:', request.userId_of_Taken);
        taken = true;
        requestData.message = 'You have a material that a requester needs. Please approve or reject the request.';
        const takenRequest = {
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
    res.status(200).json({ token, requestData});
  });

exports.approveRequest = asyncErrorHandler(async (req, res) => {
    console.log('approved', req.body)
    const { user, status } = req.body;
    await MaterialRequest.findOneAndUpdate(
      { userId_of_taken: user._id },
      { status },
      { new: true }
    );  
    res.status(200).json({ message: 'Request approved' });
  });

exports.rejectRequest = asyncErrorHandler(async (req, res) => {
    console.log('rejected', req.body)
    const { user, status } = req.body;
    await MaterialRequest.findOneAndUpdate(
      { userId_of_taken: user._id },
      { status },
      { new: true }
    );  
    res.status(200).json({ message: 'Request rejected' });
  });


































// Get All Users --ADMIN
exports.getAllUsers = asyncErrorHandler(async (req, res, next) => {

  const users = await Workers.find();

  res.status(200).json({
      success: true,
      users,
  });
});
