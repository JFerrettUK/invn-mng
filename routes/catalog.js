const express = require("express");
const router = express.Router();

// Require controller modules
const categoryController = require("../controllers/categoryController");
const productController = require("../controllers/productsController");

// Category Routes
router.get("/category/create", categoryController.categoryCreateGet);
router.post("/category/create", categoryController.categoryCreatePost);
router.get("/categories", categoryController.categoryList);
router.get("/category/:id", categoryController.categoryDetail);
router.get("/category/:id/update", categoryController.categoryUpdateGet);
router.post("/category/:id/update", categoryController.categoryUpdatePost);
router.get("/category/:id/delete", categoryController.categoryDeleteGet);
router.post("/category/:id/delete", categoryController.categoryDeletePost);

// Product Routes
router.get("/product/create", productController.productCreateGet);
router.post("/product/create", productController.productCreatePost);
router.get("/products", productController.productList);
router.get("/product/:id", productController.productDetail);
router.get("/product/:id/update", productController.productUpdateGet);
router.post("/product/:id/update", productController.productUpdatePost);
router.get("/product/:id/delete", productController.productDeleteGet);
router.post("/product/:id/delete", productController.productDeletePost);

// Optional: Route to list products by category
router.get("/products/:categoryId", productController.productList);

// 404 Error Handler (Catch-all Route) -- Moved to the END
router.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// Error Handling Middleware (for this router)
router.use((err, req, res, next) => {
  // Log error for debugging
  console.error(err.stack);

  // Render the error page
  res.status(err.status || 500);
  res.render("error", { message: err.message, error: err });
});

module.exports = router;
