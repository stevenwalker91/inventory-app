var express = require('express');
var router = express.Router();
const productController = require('../controllers/productController');

// Get list of products page
router.get('/', productController.product_list);

// Get form to create a new product
router.get('/create', productController.product_create_get);

// Handle submission of create product form
router.post('/create', productController.product_create_post);

// Get the product detail page
router.get('/:id', productController.product_get_detail);


// Handle deletes
router.delete('/:id', productController.product_delete);

// Open the product for editing
router.get('/:id/update', productController.product_update_detail_get);

// Send and handle product edits
router.post('/:id/update', productController.product_update_detail_post);


module.exports = router;