const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CategorySchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
    slug: { type: String, unique: true }, // Optional, for friendly URLs
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to generate a slug from the category name
CategorySchema.pre("save", function (next) {
  this.slug = this.name.toLowerCase().replace(/\s+/g, "-");
  next();
});

module.exports = mongoose.model("Category", CategorySchema);
