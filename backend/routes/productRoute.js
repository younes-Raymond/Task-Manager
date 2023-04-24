const express = require('express');
const { createProduct, getProducts, updateProductStock  } = require('../controllers/productController');
const router = express.Router();

router.route('/admin/product/new').post(createProduct); 
router.route('/admin/products/all').get(getProducts); 
router.route('/admin/product/:id').put(updateProductStock); 

module.exports = router;