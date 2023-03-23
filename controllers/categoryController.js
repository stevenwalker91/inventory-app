const { body, validationResult } = require('express-validator');
const Category = require('../models/category');
const Product = require('../models/product');

// get the category list
exports.category_list = async function(req, res, next)  {

  const categories = await Category.find();

  res.render('category_list', { title: 'Categories', category_list: categories });
}

// Get form to create a new product
exports.category_create_get= function(req, res, next) {
  res.render('category_create', {title: 'Create Category'});
}

// Hanlde posted new categories
exports.category_create_post = [
  // first perform validation and sanitisation
  body('title')
    .trim()
    .isLength({ min: 1 })
    .escape() // escapes html to prevent xss
    .withMessage('Product name is mandatory'),
  body('description')
    .trim()
    .isLength({ min: 5 })
    .escape()
    .withMessage('Please enter a proper description (at least 5 characters)'),
  async (req, res, next) => {
    const errors = validationResult(req);
    console.log(errors)
    if (!errors.isEmpty()) {
      // errors found that need to be handled
      res.status(422);
      res.render('category_create', {
        title: 'Create Category', 
        errors: errors.array(),
        category: req.body
      })
      return;
    }

    // destructure the request body 
    const {title, description} = req.body;
    // no errors so add the cat
    const category = new Category({
      name: title,
      description
    });

    // promise resolves if save is successful, otherwise throw err
    await category.save()
      .then(doc => {
        res.redirect('/categories');
      })
      .catch((err) => {
        console.log(err);
        res.send(400);
      });
  }
]

exports.category_detail = async function(req, res, next) {
  const id = req.params.id;
  
  const category = await Category.findById(id);

  res.render('category_detail', { category });
}

exports.category_delete = async function (req, res, next) {
  req.method = "GET"

  const products = await Product.find({category: req.params.id})

  if (products.length === 0) {
    const deleteditem = await Category.findByIdAndRemove(req.params.id);
    res.send(200)
  } else {
    // can't delete
    const category = await Category.findById(req.params.id);
    res.status(409).json({error: 'This category has products assigned, all products must be removed from category ebfore it can be deleted'})
  }
}

exports.category_edit_get = async function (req, res, next) {
  const id = req.params.id;

  const category = await Category.findById(id);
  console.log(category)

  category.title = category.name;

  res.render('category_create', {title: 'Edit Category', category})
}


exports.category_edit_post = [
  // first perform validation and sanitisation
  body('title')
    .trim()
    .isLength({ min: 1 })
    .escape() // escapes html to prevent xss
    .withMessage('Product name is mandatory'),
  body('description')
    .trim()
    .escape(),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // errors found that need to be handled
      res.status(422);
      res.render('category_create', {
        title: 'Create Category', 
        errors: errors.array(),
        category: req.body
      })
      return;
    }

    // destructure the request body 
    const {title, description} = req.body;
    // no errors so add the cat
    const category = new Category({
      _id: req.params.id,
      name: title,
      description
    });

    // promise resolves if save is successful, otherwise throw err
    await Category.replaceOne({_id: req.params.id}, category)
      .then(doc => {
        res.redirect(`/categories/${req.params.id}`);
      })
      .catch((err) => {
        console.log(err);
        res.send(400);
      });
  }
]