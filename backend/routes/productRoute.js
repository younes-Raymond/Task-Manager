const express = require('express');
const { createProduct, getProducts, updateUserTakenInfo, sendRequest, searchProducts, updateGeolocation} = require('../controllers/productController');
const router = express.Router();

router.get('/products/search/:keyword', searchProducts);
router.route('/admin/products/all').get(getProducts); 
router.route('/admin/material/new').post(createProduct); 
router.route('/admin/material/:productId').put(updateUserTakenInfo); 
router.route('/material/request').post(sendRequest);
router.route('/updateLocation').post(updateGeolocation)


module.exports = router;
