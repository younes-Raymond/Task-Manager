const Material = require('../models/productModel');
const Workers = require('../models/userModel');
const MaterialRequest = require('../models/MaterialRequestModel');
const asyncErrorHandler = require('../middlewares/asyncErrorHandler');
const cloudinary = require('cloudinary');
const mongoose = require('mongoose');
// const admin = require('firebase-admin'); 
// const axios = require('axios')


// Create Product ---ADMIN
exports.createProduct = asyncErrorHandler(async (req, res, next) => {
  console.log(req.body)
const {name,description,stock,images, category} = req.body
try{
    const result = await cloudinary.uploader.upload(images, {
        folder:"Materials",
        width:300,
        crop:"scale"
    });
    const product = await Material.create({
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
        product
    })

} catch(error) {
    console.log(error);
    next(error)
}
});



// get all product from db and send it to the client side  
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
      materialId: { $in: products.map(product => product._id) },
      requesterId: userId,
      status: 'pending',
    }).populate('requesterId');

    // Add a new property to the material object to indicate that there is a pending request
    const productsWithRequests = products.map(product => {
      const request = materialRequests.find(request => request.materialId.toString() === product._id.toString());
      if (request) {
        return {
          ...product.toObject(),
          hasPendingRequest: true,
          requester: request.requesterId,
        };
      } else {
        return product.toObject();
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

// update the worker taken the material when worker click to get and fill the inpust and info 
exports.updateUserTakenInfo = async (req, res) => {
  // console.log(typeof req.body.userIdS) // string
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
    // console.log('user:', user); // log the user object
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
  console.log(req.body)
  const { materialId, name, destination, email, userIdLS, userId_of_Taken, requesterDestination } = req.body;
  try {
    // Find the user who made the request
    const requester = await Workers.findById(userIdLS);

    // Find the user who will receive the material
    const worker = await Workers.findById(userId_of_Taken);

    // Find the material
    const material = await Material.findById(materialId);

    console.log(requester.avatar, requester.name);

    console.log(material.images, material.name);

    // Create a new MaterialRequest document
    const materialRequest = new MaterialRequest({
      materialId,
      requesterId: userIdLS,
      userId_of_Taken: userId_of_Taken,
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
      product: material,
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



// Replace 'New Delhi' with the name of the post office branch you want to search
// const postOfficeBranchName = 'New Delhi';

// axios.get(`https://api.postalpincode.in/postoffice/${postOfficeBranchName}`)
//   .then(response => {
//     const data = response.data[0];
//     console.log(data)
//     if (data.Status === "Success") {
//       const postOffices = data.PostOffice;
//       postOffices.forEach(postOffice => {
//         console.log(postOffice.Pincode);
//       });
//     } else {
//       console.log("No post office found for the given city name");
//     }
//   })
//   .catch(error => {
//     console.log(error);
//   });


