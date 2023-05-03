const Material = require('../models/productModel');
const UserTaken = require('../models/userModel');
const  MaterialRequest = require('../models/MaterialRequestModel');
const asyncErrorHandler = require('../middlewares/asyncErrorHandler');
const cloudinary = require('cloudinary');


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
  //  console.log(products, 'hello im from product controller')
    if (!products) {
      return res.status(404).json({
        success: false,
        message: 'No products found',
      });
    }

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error)
    next(error);
  }
});




exports.updateUserTakenInfo = async (req, res) => {
  console.log(req.body)
  console.log(req.params)
  const { name, destination, email } = req.body;
  const { productId } = req.params;
  try {
    const material = await Material.findById(productId);
    if (!material) {
      return res.status(404).json({ message: 'Material not found' });
    }
    const userTaken = new UserTaken({
      name,
      destination,
      email,
      takenAt: Date.now(),
    });
    material.users.push(userTaken);
    material.stock -= 1;
    await material.save();
    await userTaken.save();
    res.status(200).json(material);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error' });
  }
}

  exports.sendRequest = asyncErrorHandler(async (req, res, next) => {
    console.log(req.body)

    // const { userId, materialId, name, destination, email } = req.body;
    // try {
    //   const material = await Material.findById(materialId);
    //   if (!material) {
    //     return res.status(404).json({ message: 'Material not found' });
    //   }
    //   const user = { name, destination, email};
    //   material.users.push(user);
    //   await material.save();
    //   res.status(200).json({ message: 'Request sent successfully!', product: material });
    // } catch (error) {
    //   console.log(error);
    //   next(error);
    // }

  });

  