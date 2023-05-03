const express = require('express');
const { createProduct, getProducts, updateUserTakenInfo, sendRequest} = require('../controllers/productController');
const router = express.Router();


router.route('/admin/products/all').get(getProducts); 
router.route('/admin/product/new').post(createProduct); 
router.route('/admin/product/:productId').put(updateUserTakenInfo); 
router.route('/material/request').post(sendRequest);


module.exports = router;
