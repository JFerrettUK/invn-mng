const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = new Schema(
  {
    name: { type: String, required: true, maxLength: 100 },
    pcode: { type: String },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    description: { type: String },
    price: { type: Number, required: true, min: 0 },
    // url: { type: String },  // Remove this if you're not storing URLs directly
  },
  {
    timestamps: true,
  }
);

// Virtual for product's URL (renamed to _url)
ProductSchema.virtual("_url").get(function () {
  return `/catalog/product/${this._id}`;
});

// Compound Index
ProductSchema.index({ name: 1, brand: 1, model: 1 }, { unique: true }); // Ensure unique product names

module.exports = mongoose.model("Product", ProductSchema);
