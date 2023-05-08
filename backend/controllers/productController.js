const Material = require('../models/productModel');
const Workers = require('../models/userModel');
const  MaterialRequest = require('../models/MaterialRequestModel');
const asyncErrorHandler = require('../middlewares/asyncErrorHandler');
const cloudinary = require('cloudinary');
const mongoose = require('mongoose');


// Create Product ---ADMIN
exports.createProduct = asyncErrorHandler(async (req, res, next) => {
  console.log(req.body)
const {name,description,stock,images, category} = req.body
try{
    const result = await cloudinary.uploader.upload(images, {
        folder:"Materials",
        // width:300,
        // crop:"scale"
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
  console.log(typeof req.body.userIdS) // string
  const { name, destination, email, userIdS } = req.body;
  console.log('userIdS:', userIdS); // log the userIdS value
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
      userIdS,
      takenAt: Date.now(),
    };
    console.log('user:', user); // log the user object
    material.users.push(user);
    material.stock -= 1;
    await material.save();
    console.log('material:', material); // log the material object
    res.status(200).json(material);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error' });
  }
};



exports.sendRequest = asyncErrorHandler(async (req, res, next) => {
  // console.log(req.body)


  // const { userIdS ,userId, materialId, name, destination, email } = req.body;
  // try {
  //   const material = await Material.findById(materialId);
  //   if (!material) {
  //     return res.status(404).json({ message: 'Material not found' });
  //   }
  //   // Create a new MaterialRequest document
  //   const materialRequest = new MaterialRequest({
  //     materialId,
  //     requesterId: userIdS,
  //     requestDate: new Date(),
  //     status: 'pending',
  //     name,
  //     destination,
  //     email,
  //   });
  //   await materialRequest.save();
  //   res.status(200).json({ message: 'Request sent successfully!', product: material });
  // } catch (error) {
  //   console.log(error);
  //   next(error);
  // }

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

