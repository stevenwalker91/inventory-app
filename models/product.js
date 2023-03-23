const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: {type: String, required: true},
  description: {type: String},
  price: {type: Number, required: true},
  stock: {type: Number, required: true},
  category: [{type: mongoose.Schema.Types.ObjectId, ref: "Category"}],
  imageUrl: {type: String}
});

ProductSchema.virtual('url').get(function() {
  return `/products/${this._id}`
})


module.exports = mongoose.model('Product', ProductSchema);

