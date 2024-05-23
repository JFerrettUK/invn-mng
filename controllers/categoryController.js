const Category = require("../models/categories");
const Product = require("../models/products"); // Import Product model
const { body, validationResult } = require("express-validator");

exports.categoryList = async (req, res, next) => {
  try {
    const allCategories = await Category.find().sort({ name: 1 }).exec();
    res.render("category_list", {
      title: "Category List",
      category_list: allCategories,
    });
  } catch (err) {
    return next(err);
  }
};

exports.categoryDetail = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id).exec();
    if (!category) {
      const err = new Error("Category not found");
      err.status = 404;
      return next(err);
    }
    const productsInCategory = await Product.find({
      category: req.params.id, // Use the _id from the URL to match products
    })
      .populate("category")
      .exec();

    res.render("category_detail", {
      title: `Category: ${category.name}`,
      category,
      product_list: productsInCategory,
    });
  } catch (err) {
    return next(err);
  }
};

exports.categoryCreateGet = (req, res, next) => {
  res.render("category_form", { title: "Create Category" });
};

exports.categoryCreatePost = [
  body("name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Name must be specified"),
  body("description").optional({ checkFalsy: true }).trim().escape(),

  async (req, res, next) => {
    const errors = validationResult(req);
    const category = new Category({
      name: req.body.name,
      description: req.body.description,
    });

    if (!errors.isEmpty()) {
      res.render("category_form", {
        title: "Create Category",
        category,
        errors: errors.array(),
      });
      return;
    }

    try {
      await category.save();
      res.redirect(category._url); // Use _url instead of url
    } catch (err) {
      return next(err);
    }
  },
];

exports.categoryUpdateGet = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id).exec();
    if (!category) {
      const err = new Error("Category not found");
      err.status = 404;
      return next(err);
    }

    res.render("category_form", { title: "Update Category", category });
  } catch (err) {
    return next(err);
  }
};

exports.categoryUpdatePost = [
  body("name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Name must be specified"),
  body("description").optional({ checkFalsy: true }).trim().escape(),

  async (req, res, next) => {
    const errors = validationResult(req);
    const category = new Category({
      name: req.body.name,
      description: req.body.description,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      res.render("category_form", {
        title: "Update Category",
        category,
        errors: errors.array(),
      });
      return;
    }

    try {
      await Category.findByIdAndUpdate(req.params.id, category, {});
      res.redirect(category.url);
    } catch (err) {
      return next(err);
    }
  },
];

exports.categoryDeleteGet = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id).exec();
    if (!category) {
      res.redirect("/catalog/categories");
      return;
    }

    res.render("category_delete", { title: "Delete Category", category });
  } catch (err) {
    return next(err);
  }
};

exports.categoryDeletePost = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndRemove(req.params.id);

    // Update products that reference this category
    await Product.updateMany({ category: category._id }, { category: null }); // Or a default ID

    res.redirect("/catalog/categories");
  } catch (err) {
    return next(err);
  }
};
