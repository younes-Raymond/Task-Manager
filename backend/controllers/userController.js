const Workers = require('../models/userModel');
const Materials = require('../models/productModel');
const Jobs = require('../models/jobsModel');
const asyncErrorHandler = require('../middlewares/asyncErrorHandler');
const cloudinary = require('cloudinary');
const sendToken = require('../utils/sendToken');
const MaterialRequest = require('../models/MaterialRequestModel');
const { connect } = require('mongoose');
const fs = require('fs');
const { promisify } = require('util');

// Register User
exports.registerUser = asyncErrorHandler(async (req, res, next) => {
  console.log(req.body);

const { name, email, position, salary, gender, nationalId, phoneNumber, legalInfo, password } = req.body;

  try {
    const result = await cloudinary.uploader.upload(req.body.avatar[0], {
      folder: "workers",
      width: 150,
      crop: "scale"
    });

    const user = await Workers.create({
      name,
      email,
      position,
      salary,
      gender,
      nationalId,
      phoneNumber,
      password,
      legalInfo,
      avatar: {
        public_id: result.public_id,
        url: result.secure_url
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
    // console.log('approved', req.body)
    const { user, status } = req.body;
    await MaterialRequest.findOneAndUpdate(
      { userId_of_taken: user._id },
      { status },
      { new: true }
    );  
    res.status(200).json({ message: 'Request approved' });
  });

exports.rejectRequest = asyncErrorHandler(async (req, res) => {
    // console.log('rejected', req.body)
    const { user, status } = req.body;
    await MaterialRequest.findOneAndUpdate(
      { userId_of_taken: user._id },
      { status },
      { new: true }
    );  
    res.status(200).json({ message: 'Request rejected' });
});

exports.confirmTaken = asyncErrorHandler(async (req, res) => {
    const requestId = req.body.approvedRequests[0].requestId;
    
    // Remove the document with the specified requestId from the database
    await MaterialRequest.findOneAndRemove({ requestId });
  
    // console.log(`Document with requestId ${requestId} removed from the database.`);
});
  
exports.search = async (req, res) => {
    console.log(req.query)
    const { keyword } = req.query;
    try {
      // Search in users collection
      const users = await   Workers.find({
        $or: [
          { name: { $regex: keyword, $options: 'i' } },
          { email: { $regex: keyword, $options: 'i' } }
        ]
      });
      // Search in materials collection
      const materials = await Materials.find({
        $or: [
          { name: { $regex: keyword, $options: 'i' } },
          { description: { $regex: keyword, $options: 'i' } }
        ]
      });
      res.status(200).json({ success: true, users, materials });
      // console.log(materials)
      // console.log(users);
    } catch (error) {
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
};

exports.addJobs = asyncErrorHandler(async (req, res) => {
  console.log(req.body)
    try {
      const { title, description, requirements, salary, email, phone } = req.body;
  
      // Create a new job document
      const newJob = await Jobs.create({
        title,
        description,
        requirements,
        salary,
        applicationDetails: {
          email,
          phone
        }
      });
  
      // Send a success response
      res.status(200).json({ success: true, job: newJob });
    } catch (error) {
      // Handle any errors
      console.error("Error creating job:", error);
      res.status(500).json({ success: false, error: "Failed to create job" });
    }
});

exports.getAllJobs = asyncErrorHandler(async (req, res) => {
  console.log(req.body);
  try {
    const jobs = await Jobs.find();
    if (!jobs) {
      return res.status(404).json({
        success: false,
        message: 'No jobs found',
      });
    }
    // Process the fetched jobs or return a response
    res.status(200).json({
      success: true,
      data: jobs,
    });
  } catch (error) {
    // Handle the error
    console.error('Error fetching jobs:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching jobs',
    });
  }
});


exports.applyJob = asyncErrorHandler(async (req, res, next) => {
  // console.log(req.body);
  // console.log(req.files);
  try {
    const { jobId, name, email, message } = req.body;
    const file = req.files.file;

    if (!file) {
      return res.status(400).json({ success: false, message: 'No file found in the request' });
    }

    // Convert the file data to base64 encoding
    const fileData = file.data.toString('base64');

    // Upload the base64-encoded file to Cloudinary
    const result = await cloudinary.uploader.upload(`data:${file.mimetype};base64,${fileData}`, {
      folder: 'applicants',
      resource_type: 'auto'
    });

    // Get the secure URL of the uploaded file
    const fileUrl = result.secure_url;

    // Find the job post by its ID
    const jobPost = await Jobs.findById(jobId);

    if (!jobPost) {
      return res.status(404).json({ success: false, message: 'Job post not found' });
    }
    jobPost.counter += 1; 
    // Push the new applicant's information to the applicants array
    jobPost.applicants.push({ name, email, file: fileUrl, message });

    // Save the updated job post
    await jobPost.save();

    res.status(200).json({ success: true, message: 'Form submitted successfully' });
  } catch (error) {
    console.error('Error applying for job:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Get All Users --ADMIN
exports.getAllUsers = asyncErrorHandler(async (req, res, next) => {
  const users = await Workers.find();
 console.log(users)
  res.status(200).json({
      success: true,
      users,
  });
});


exports.getAllMaterialRequester = asyncErrorHandler(async (req, res) => {
  const materialRequesters = await MaterialRequest.find();
  res.status(200).json(materialRequesters);
});

exports.deleteUser = asyncErrorHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const worker = await Workers.findByIdAndRemove(id);
    res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Unable to delete user' });
  }
});


