const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

// Present list of categories
router.get('/', categoryController.category_list);

// Present form to create a new category
router.get('/create', categoryController.category_create_get);

// New category submissions
router.post('/create', categoryController.category_create_post);


// Get the category detail page
router.get('/:id', categoryController.category_detail);


router.get('/:id/update', categoryController.category_edit_get);

router.post('/:id/update', categoryController.category_edit_post);

router.delete('/:id', categoryController.category_delete);





module.exports = router;