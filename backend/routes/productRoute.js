const express = require('express');
const {createProduct , getProducts } = require('../controllers/productController');
const router = express.Router();

router.route('/admin/product/new').post(createProduct); 
router.route('/admin/products/all').get(getProducts); 

module.exports = router;