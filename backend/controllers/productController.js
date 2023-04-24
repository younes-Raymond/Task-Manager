const Material = require('../models/productModel');
const asyncErrorHandler = require('../middlewares/asyncErrorHandler');
const cloudinary = require('cloudinary');


// Create Product ---ADMIN
exports.createProduct = asyncErrorHandler(async (req, res, next) => {
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


//const Product = require('../models/Product');


// Update the stock of a product with the specified ID
exports.updateProductStock = async (req, res) => {
  console.log(req.params)
  
  try {
    const { id } = req.params;

    const product = await Material.findById(id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.stock === 0) {
      return res.status(400).json({ message: 'Product out of stock' });
    }

    product.stock -= 1;

    const updatedProduct = await product.save();

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error' });
  }
};

