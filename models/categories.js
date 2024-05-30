const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CategorySchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
    slug: { type: String, unique: true },
  },
  {
    timestamps: true,
  }
);

// Virtual for category's URL
CategorySchema.virtual("_url").get(function () {
  return `/catalog/category/${this._id}`;
});

// Pre-save hook to generate a slug from the category name
CategorySchema.pre("save", function (next) {
  this.slug = this.name.toLowerCase().replace(/\s+/g, "-");
  next();
});

module.exports = mongoose.model("Category", CategorySchema);
