const express = require("express");
const router = express.Router();

// Require controller modules
const categoryController = require("../controllers/categoryController");
const productController = require("../controllers/productsController");

// Category Routes
router.get("/categories", categoryController.categoryList);

router.get("/category/create", categoryController.categoryCreateGet);
router.post("/category/create", categoryController.categoryCreatePost);

router.get("/category/:id", categoryController.categoryDetail);
router.get("/category/:id/update", categoryController.categoryUpdateGet);
router.post("/category/:id/update", categoryController.categoryUpdatePost);
router.get("/category/:id/delete", categoryController.categoryDeleteGet);
router.post("/category/:id/delete", categoryController.categoryDeletePost);

// Product Routes
router.get("/products", productController.productList);

router.get("/product/create", productController.productCreateGet);
router.post("/product/create", productController.productCreatePost);

router.get("/product/:id", productController.productDetail);
router.get("/product/:id/update", productController.productUpdateGet);
router.post("/product/:id/update", productController.productUpdatePost);
router.get("/product/:id/delete", productController.productDeleteGet);
router.post("/product/:id/delete", productController.productDeletePost);

// Optional: Route to list products by category
router.get("/products/:categoryId", productController.productList);

// 404 Error Handler (Catch-all Route)
router.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

module.exports = router;
