const express = require('express');
const { createProduct, getProducts, updateUserTakenInfo} = require('../controllers/productController');
const router = express.Router();

router.route('/admin/product/new').post(createProduct); 
router.route('/admin/products/all').get(getProducts); 
router.route('/admin/product/:productId').put(updateUserTakenInfo); 

module.exports = router;
