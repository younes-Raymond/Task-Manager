const Material = require('../models/productModel');
const Workers = require('../models/userModel');
const MaterialRequest = require('../models/MaterialRequestModel');
const asyncErrorHandler = require('../middlewares/asyncErrorHandler');
const cloudinary = require('cloudinary');
const { Types } = require('mongoose');
const axios = require('axios');


// Create material ---ADMIN
exports.createProduct = asyncErrorHandler(async (req, res, next) => {
  // console.log(req.body)
const { name, description, stock, images, category} = req.body
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

// get all materials from db and send it to the client side  
exports.getProducts = asyncErrorHandler(async (req, res, next) => {
  try {
    const products = await Material.find();
    // console.log(products)
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

// Get Button in UI update the worker taken the material when worker click to get 
exports.updateUserTakenInfo = async (req, res) => {
  // console.log('materialId: ' , req.params, 'updateUserTakenInfo....',req.body)
  const { name, destination, email, userIdLS , longitude, latitude} = req.body;
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
      latitude,
      longitude
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
  // console.log('sendRequest => ',req.body);
  // console.log(req.body.userId_of_Taken);
  const { materialId, name, destination, email, userIdLS, requesterDestination } = req.body;
  const userId_of_Taken = req.body.userId_of_Taken;
  try {
    const requester = await Workers.findById(userIdLS);

    const worker = await Workers.findById(userId_of_Taken);
    const material = await Material.findById(materialId);
    
// Find the user inside the users array with the given userId_of_Taken

let foundUserIdLS;

for (const user of material.users) {
  if (user._id.toString() === userId_of_Taken.toString()){
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
  userId_of_Taken: foundUserIdLS, 
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
  // console.log(req.query);
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
//  console.log(response);
 res.status(200).json(response)
});


exports.updateGeolocation = asyncErrorHandler(async (req, res, next) => {
  // console.log(req.body);
  const { latitude, longitude, userIdLS, materialId } = req.body;
  console.log("Update material:id:", materialId);
  try {
    if (!materialId) {
      console.log('Invalid materialId:', materialId);
      return;
    }

    // Find the material by its ID
    const material = await Material.findOne({ _id: materialId });

    if (material) {
      // Find the user with the matching userIdLS
      const user = material.users.find((user) => user.userIdLS === userIdLS);

      if (user) {
        // Update the user's latitude and longitude if they don't match the old values
        if (user.latitude !== latitude || user.longitude !== longitude) {
          user.latitude = latitude;
          user.longitude = longitude;
          await material.save(); // Save the changes to the material document
          console.log('User location updated:', user);
        } else {
          console.log('User location already up to date:', user);
        }
      } else {
        console.log('User not found for the given userIdLS:', userIdLS);
      }
    } else {
      console.log('Material not found for the given materialId:', materialId);
    }
  } catch (error) {
    console.error('Error updating user location:', error);
  } finally {
    // Send a response back to the client if needed
  }
});


exports.updateGeolocationByIp = async (req, res) => {
  console.log(req.body);
  const myApiKey = '6c105f5d9e926dc7f86df2da63b2e5f3';

  if (req.body.ipAddress) {
    const { ipAddress } = req.body;
    const url = `http://api.ipstack.com/${ipAddress}?access_key=${myApiKey}`;
    
    try {
      const response = await axios.get(url);
      console.log("lat & lon response: ", response.data);
      
      return res.json(response.data);
    } catch (error) {
      console.error('Error getting IP geolocation:', error.message);
      return res.status(500).json({ message: 'Error getting IP geolocation' });
    }
  }
  
  const { ipAddress, userIdLS, materialId } = req.body;
  const url = `http://api.ipstack.com/${ipAddress}?access_key=${myApiKey}`;
  try {
    const response = await axios.get(url);
    // console.log("lat & lon response: ", response.data);
    
    const { latitude, longitude } = response.data;
    Material.findOneAndUpdate(
      { _id: materialId, 'users.userIdLS': userIdLS },
      { $set: { 'users.$.latitude': latitude, 'users.$.longitude': longitude } },
      { new: true }
    )
      .then((updatedMaterial) => {
        // console.log(updatedMaterial);
        if (updatedMaterial) {
          console.log('Geolocation updated successfully');
          res.json({ latitude, longitude }); // Send latitude and longitude in the response
        } else {
          console.log('Material not found or user not authorized');
          res.status(404).json({ message: 'Material not found or user not authorized' });
        }
      })
      .catch((error) => {
        console.error('Failed to update geolocation:', error.message);
        res.status(500).json({ message: 'Failed to update geolocation' });
      });
  } catch (error) {
    console.error('Error getting IP geolocation:', error.message);
    res.status(500).json({ message: 'Error getting IP geolocation' });
  }
};





exports.deleteMaterial =  asyncErrorHandler( async (req, res) => {
  try {
    const { id } = req.params;
    await Material.findByIdAndRemove(id);
    res.status(200).json({ success: true, message: 'Material deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Unable to delete material' });
  }
});

exports.editMaterials = asyncErrorHandler(async (req, res) => {
  console.log('i got it req', req.body); 
  const { id, field, value } = req.body;

  try {
    const material = await Material.findById(id);

    if (!material) {
      return res.status(404).json({ message: 'Material not found' });
    }

    if (!material[field]) {
      return res
        .status(400)
        .json({ message: `Field ${field} does not exist in the material model` });
    }

    material[field] = value;

    await material.save(); // Corrected, added ()

    // console.log('Material updated:', material);
    return res.status(200).json({ message: 'Material updated successfully', material });
  } catch (error) {
    console.error('Error updating material:', error);

    // Send an error response
    return res.status(500).json({ message: 'Error updating material', error });
  }
});



