const express = require("express");

const protect = require("../middleware/authMiddleware");

const {
  addProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
  getProductsByPrice,
  getProductsByRating,
} = require("../controller/productController");

const router = express.Router();

router.get("/featured", protect, getFeaturedProducts);

router.get("/price", protect, getProductsByPrice);

router.get("/rating", protect, getProductsByRating);

router.post("/", protect, addProduct);

router.get("/", protect, getProducts);

router.put("/:productId", protect, updateProduct);

router.delete("/:productId", protect, deleteProduct);

module.exports = router;