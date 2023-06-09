const Material = require('../models/productModel');
const Workers = require('../models/userModel');
const MaterialRequest = require('../models/MaterialRequestModel');
const asyncErrorHandler = require('../middlewares/asyncErrorHandler');
const cloudinary = require('cloudinary');
const mongoose = require('mongoose');
// const admin = require('firebase-admin'); 
// const axios = require('axios')


// get all material from db and send it to the client side  
exports.getProducts = asyncErrorHandler(async (req, res, next) => {
  try {
    const products = await Material.find();
    if (!products) {
      return res.status(404).json({
        success: false,
        message: 'No products found',
      });
    }

    // Check if the current user has any pending requests for the materials in the list
const userId = req.query.userId;
    const materialRequests = await MaterialRequest.find({
      materialId: { $in: products.map(material => material._id) },
      requesterId: userId,
      status: 'pending',
    }).populate('requesterId');

    // Add a new property to the material object to indicate that there is a pending request
    const productsWithRequests = products.map(material => {
      const request = materialRequests.find(request => request.materialId.toString() === material._id.toString());
      if (request) {
        return {
          ...material.toObject(),
          hasPendingRequest: true,
          requester: request.requesterId,
        };
      } else {
        return material.toObject();
      }
    });

    res.status(200).json({
      success: true,
      products: productsWithRequests,
    });
  } catch (error) {
    console.log(error)
    next(error);
  }
});


// Create material ---ADMIN
exports.createProduct = asyncErrorHandler(async (req, res, next) => {
  console.log(req.body)
const {name,description,stock,images, category} = req.body
try{
    const result = await cloudinary.uploader.upload(images, {
        folder:"Materials",
        width:300,
        crop:"scale"
    });
    const material = await Material.create({
        name:name,
        description,
        stock,
        images: {
            public_id:result.public_id,
            url:result.secure_url
        },
        category
    });
    res.status(201).json({
        success:true,
        material
    })

} catch(error) {
    console.log(error);
    next(error)
}
});



// update the worker taken the material when worker click to get and fill the inpust and info 
exports.updateUserTakenInfo = async (req, res) => {
  console.log('....',req.body)
  const { name, destination, email, userIdLS } = req.body;
  console.log('userIdS:', userIdLS); // log the userIdLS value
  const { productId } = req.params;
  try {
    const material = await Material.findById(productId);
    if (!material) {
      return res.status(404).json({ message: 'Material not found' });
    }
    const user = {
      name,
      destination,
      email,
      userIdLS,
      takenAt: Date.now(),
    };
    material.users.push(user);
    material.stock -= 1;
    await material.save();
    // console.log('material:', material); // log the material object
    res.status(200).json(material);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.sendRequest = asyncErrorHandler(async (req, res, next) => {
  // console.log(req.body);
  console.log(req.body.userId_of_Taken);
  const { materialId, name, destination, email, userIdLS, requesterDestination } = req.body;
  const userId_of_Taken = req.body.userId_of_Taken;
  try {
    // Find the user who made the request
    const requester = await Workers.findById(userIdLS);

    // Find the user who will receive the material
    const worker = await Workers.findById(userId_of_Taken);

    // Find the material
    const material = await Material.findById(materialId);
    
// Find the user inside the users array with the given userId_of_Taken
// console.log(material);
console.log('array', material.users);


let foundUserIdLS;


for (const user of material.users) {
  if (user._id.toString() === userId_of_Taken){
    foundUserIdLS = user.userIdLS;
    break;
  }
}
if (!foundUserIdLS) {
  console.log('User not found in the users array. ');
  throw new Error('User not found ')
}

// Create a new MaterialRequest document
const materialRequest = new MaterialRequest({
  materialId,
  requesterId: userIdLS,
  userId_of_Taken: foundUserIdLS, // Use the found userIdLS
  requestDate: new Date(),
  status: 'pending',
  name,
  email,
  requesterName: requester.name,
  requesterAvatar: requester.avatar.url,
  requesterDestination: destination,
  materialPicture: material.images.url,
});

    await materialRequest.save();

    // Store the response in a database
    const response = {
      message: 'Request sent successfully!',
      material: material,
      userData: {
        name: requester.name,
        avatar: requester.avatar,
        destination: requesterDestination,
      },
      materialData: {
        picture: material.images,
      },
      requestDate: materialRequest.requestDate,
    };

    // Send the response back
    res.json(response);
  } catch (error) {
    console.log(error);
    next(error);
  }
});






  // Get All Products
exports.searchProducts = asyncErrorHandler(async (req, res, next) => {
  console.log(req.query);
  const resultPerPage = 12;
  const productsCount = await Material.countDocuments();

  const searchFeature = new SearchFeatures(Material.find(), req.query)
      .search()
      .filter();

  let products = await searchFeature.query;
  let filteredProductsCount = products.length;

  searchFeature.pagination(resultPerPage);

  products = await searchFeature.query.clone();

 const response = {
  success:true,
  products,
  productsCount,
  resultPerPage,
  filteredProductsCount,
 };
 console.log(response);
 res.status(200).json(response)
});







