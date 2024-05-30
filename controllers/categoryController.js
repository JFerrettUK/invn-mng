const Category = require("../models/categories");
const Product = require("../models/products");
const { body, validationResult } = require("express-validator");

// Display list of all categories
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

// Display detail page for a specific category
exports.categoryDetail = async (req, res, next) => {
  try {
    // Check for 'new' flag in query params and delay if needed
    if (req.query.new) {
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    const [category, productsInCategory] = await Promise.all([
      Category.findById(req.params.id).exec(),
      Product.find({ category: req.params.id }).populate("category").exec(),
    ]);

    if (!category) {
      const err = new Error("Category not found");
      err.status = 404;
      return next(err);
    }

    res.render("category_detail", {
      title: `Category: ${category.name}`,
      category,
      product_list: productsInCategory,
    });
  } catch (err) {
    return next(err);
  }
};

// Display Category create form on GET
exports.categoryCreateGet = (req, res, next) => {
  res.render("category_form", { title: "Create Category" });
};

// Handle Category create on POST
exports.categoryCreatePost = [
  // Validate and sanitize fields
  body("name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Name must be specified")
    .custom(async (value) => {
      const existingCategory = await Category.findOne({ name: value });
      if (existingCategory) {
        throw new Error("Category name already exists");
      }
    }),
  body("description").optional({ checkFalsy: true }).trim().escape(),

  async (req, res, next) => {
    const errors = validationResult(req);
    const category = new Category({
      name: req.body.name,
      description: req.body.description,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.
      res.render("category_form", {
        title: "Create Category",
        category,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid. Save category.
      try {
        const savedCategory = await category.save();

        // Redirect to the newly created category's detail page (with the query flag to delay)
        res.redirect(savedCategory._url + "?new=true");
      } catch (err) {
        return next(err);
      }
    }
  },
];
// Display Category update form on GET
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

// Handle Category update on POST
exports.categoryUpdatePost = [
  // ... (validation middleware - same as create)

  async (req, res, next) => {
    const errors = validationResult(req);
    const category = new Category({
      name: req.body.name,
      description: req.body.description,
      _id: req.params.id, // This is required, or a new ID will be assigned!
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
      const updatedCategory = await Category.findByIdAndUpdate(
        req.params.id,
        category,
        { new: true } // Return the updated document
      );
      res.redirect(updatedCategory._url); // Use _url from the updated category
    } catch (err) {
      return next(err);
    }
  },
];

// Display Category delete form on GET
exports.categoryDeleteGet = async (req, res, next) => {
  try {
    const [category, allProductsByCategory] = await Promise.all([
      Category.findById(req.params.id).exec(),
      Product.find({ category: req.params.id }).exec(),
    ]);
    if (!category) {
      res.redirect("/catalog/categories");
      return;
    }
    res.render("category_delete", {
      title: "Delete Category",
      category,
      products: allProductsByCategory,
    });
  } catch (err) {
    return next(err);
  }
};

// Handle Category delete on POST
exports.categoryDeletePost = async (req, res, next) => {
  try {
    const [category, allProductsByCategory] = await Promise.all([
      Category.findById(req.params.id).exec(),
      Product.find({ category: req.params.id }).exec(),
    ]);

    if (allProductsByCategory.length > 0) {
      // Category has products. Render in same way as for GET route.
      res.render("category_delete", {
        title: "Delete Category",
        category,
        products: allProductsByCategory,
      });
      return;
    } else {
      // Category has no products. Delete object and redirect to the list of categories.
      await Category.findByIdAndDelete(req.body.categoryid);
      res.redirect("/catalog/categories");
    }
  } catch (err) {
    return next(err);
  }
};
