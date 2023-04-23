const Material = require('../models/productModel');
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
    })
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



exports.getProducts = asyncErrorHandler(async (req, res, next) => {

    try {
      const products = await Material.find();
     console.log(products, 'hello im from product controller')
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
