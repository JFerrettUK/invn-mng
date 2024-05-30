const Product = require("../models/products");
const Category = require("../models/categories");
const { body, validationResult } = require("express-validator");
const async = require("async"); // Import async for handling multiple DB operations

// Display list of all products
exports.productList = async (req, res, next) => {
  try {
    const allProducts = await Product.find().populate("category").exec();
    res.render("product_list", {
      title: "Product List",
      product_list: allProducts,
    });
  } catch (err) {
    return next(err);
  }
};

// Display detail page for a specific product
exports.productDetail = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("category")
      .exec();
    if (!product) {
      const err = new Error("Product not found");
      err.status = 404;
      return next(err);
    }
    res.render("product_detail", { title: product.name, product });
  } catch (err) {
    return next(err);
  }
};

// Display product create form on GET
exports.productCreateGet = async (req, res, next) => {
  try {
    const categories = await Category.find().exec();
    res.render("product_form", { title: "Create Product", categories });
  } catch (err) {
    return next(err);
  }
};

// Handle product create on POST
exports.productCreatePost = [
  // Validate and sanitize fields
  body("name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Name must be specified"),
  body("pcode").optional({ checkFalsy: true }).trim().escape(), // Optional pcode
  body("description").optional({ checkFalsy: true }).trim().escape(),
  body("category", "Category must be selected")
    .isMongoId()
    .withMessage("Invalid category"),
  body("price")
    .trim()
    .isFloat({ min: 0 })
    .escape()
    .withMessage("Price must be a positive number or 0"),

  // Process request after validation and sanitization
  async (req, res, next) => {
    const errors = validationResult(req);
    const product = new Product({
      name: req.body.name,
      pcode: req.body.pcode,
      description: req.body.description,
      category: req.body.category,
      price: req.body.price,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values and error messages.
      const categories = await Category.find().exec();
      res.render("product_form", {
        title: "Create Product",
        product,
        categories,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid. Save product.
      try {
        await product.save();
        res.redirect(product._url); // Use _url instead of url
      } catch (err) {
        return next(err);
      }
    }
  },
];

// Display product update form on GET
exports.productUpdateGet = async (req, res, next) => {
  try {
    const [product, categories] = await Promise.all([
      Product.findById(req.params.id).populate("category"),
      Category.find(),
    ]);

    if (!product) {
      const err = new Error("Product not found");
      err.status = 404;
      return next(err);
    }

    res.render("product_form", {
      title: "Update Product",
      product,
      categories,
    });
  } catch (err) {
    return next(err);
  }
};

// Handle product update on POST
exports.productUpdatePost = [
  // Validate and sanitize fields (same as create)
  body("name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Name must be specified"),
  body("pcode").optional({ checkFalsy: true }).trim().escape(),
  body("description").optional({ checkFalsy: true }).trim().escape(),
  body("category", "Category must be selected")
    .isMongoId()
    .withMessage("Invalid category"),
  body("price")
    .trim()
    .isFloat({ min: 0 })
    .escape()
    .withMessage("Price must be a positive number or 0"),

  // Process request after validation and sanitization
  async (req, res, next) => {
    const errors = validationResult(req);
    const product = new Product({
      name: req.body.name,
      pcode: req.body.pcode,
      description: req.body.description,
      category: req.body.category,
      price: req.body.price,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.
      const categories = await Category.find().exec();
      res.render("product_form", {
        title: "Update Product",
        product,
        categories,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid. Update the record.
      try {
        await Product.findByIdAndUpdate(req.params.id, product, {});
        // Redirect to the product list page
        res.redirect("/catalog/products");
      } catch (err) {
        return next(err);
      }
    }
  },
];

// Display product delete form on GET
exports.productDeleteGet = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("category")
      .exec();
    if (!product) {
      res.redirect("/catalog/products");
      return;
    }
    res.render("product_delete", { title: "Delete Product", product });
  } catch (err) {
    return next(err);
  }
};

// Handle product delete on POST
exports.productDeletePost = async (req, res, next) => {
  try {
    await Product.findByIdAndDelete(req.body.productid);
    res.redirect("/catalog/products");
  } catch (err) {
    return next(err);
  }
};
