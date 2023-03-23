const { body, validationResult } = require('express-validator');
const Product = require('../models/product');
const Category = require('../models/category');

// Get list of products page
exports.product_list = async function(req, res, next) {

  const products = await Product.find().populate("category");

  res.render('product_list', { title: 'Products', product_list: products });

}

// Get form to create a new product
exports.product_create_get = async function(req, res, next) {
  
  // Get the categories to display as options
  const categories = await Category.find();

  res.render('product_create', {title: 'Create Product', categories});
}

// Handle insertion of new products
exports.product_create_post = [
  // first perform validation and sanitisation
  body('title')
    .trim()
    .isLength({ min: 1 })
    .escape() // escapes html to prevent xss
    .withMessage('Product name is mandatory'),
  body('description')
    .trim()
    .escape(),
  body('price')
    .trim()
    .escape()
    .isNumeric()
    .withMessage('Price must be a number'),
  body('stock')
    .trim()
    .escape()
    .isNumeric()
    .withMessage('Price must be a number')
    .isInt()
    .withMessage('Stock must be a whole number'),
  body("category.*").escape(),
  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // errors found that need to be handled
      res.status(422);
      res.render('product_create', {
        title: 'Create Product', 
        errors: errors.array(),
        product: req.body
      })
      return;
    }

    // destructure the request body 
    const {title, description, price, stock, category} = req.body;

    // no errors so add the product
    const product = new Product({
      name: title,
      description,
      stock,
      price,
      category
    });

    // promise resolves if save is successful, otherwise throw err
    await product.save()
      .then(doc => {
        res.redirect('/products');
      })
      .catch((err) => {
        console.log(err);
        res.send(400);
      });
  }
]

exports.product_get_detail = async function(req, res, next) {
  const productId = req.params.id;
  
  const product = await Product.findById(productId).populate('category');

  res.render('product_detail', { product: product });
}

exports.product_delete = async function(req, res, next) {
  req.method = "GET"

  const deleteditem = await Product.findByIdAndRemove(req.params.id);
  res.send(200);

}

exports.product_update_detail_get = async function(req, res, next) {
  const id = req.params.id;

  const productPromise = Product.findById(id).populate('category');
  const categoriesPromise = Category.find();

  await Promise.all([productPromise, categoriesPromise]).then(([product, categories]) => {

    // template expectes a title value
    product.title = product.name;

    res.render('product_create', {title: 'Edit Product', product, categories})
  }).catch(err => {
     return next(err);
  })

}

exports.product_update_detail_post = [
  // first perform validation and sanitisation
  body('title')
    .trim()
    .isLength({ min: 1 })
    .escape() // escapes html to prevent xss
    .withMessage('Product name is mandatory'),
  body('description')
    .trim()
    .escape(),
  body('price')
    .trim()
    .escape()
    .isNumeric()
    .withMessage('Price must be a number'),
  body('stock')
    .trim()
    .escape()
    .isNumeric()
    .withMessage('Price must be a number')
    .isInt()
    .withMessage('Stock must be a whole number'),
  body("category.*").escape(),
  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // errors found that need to be handled
      res.status(422);
      res.render('product_create', {
        title: 'Create Product', 
        errors: errors.array(),
        product: req.body
      })
      return;
    }

    // destructure the request body 
    const {title, description, price, stock, category} = req.body;

    // no errors so create the updated product
    const product = new Product({
      _id: req.params.id,
      name: title,
      description,
      stock,
      price,
      category
    });
    // promise resolves if save is successful, otherwise throw err
    await Product.replaceOne({_id: req.params.id}, product)
      .then(doc => {
        res.redirect(`/products/${req.params.id}`);
      })
      .catch((err) => {
        console.log(err);
        res.send(400);
      });
  }
]