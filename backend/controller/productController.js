const Product = require('../models/Product')

// Add product
const addProduct = async (req, res) => {
  try {
    const {
      productId,
      name,
      price,
      featured,
      rating,
      company,
    } = req.body;

    const product = await Product.create({
      productId,
      name,
      price,
      featured,
      rating,
      company,
    });

    res.status(201).json({
      success: true,
      message: "Product added successfully",
      product,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Product ID already exists",
      });
    }

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all products
const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update product
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { productId: req.params.productId },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete product
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({
      productId: req.params.productId,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Featured products
const getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({
      featured: true,
    });

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Price less than value
const getProductsByPrice = async (req, res) => {
  try {
    const max = Number(req.query.max);

    if (isNaN(max)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid price",
      });
    }

    const products = await Product.find({
      price: {
        $lt: max,
      },
    });

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Rating higher than value
const getProductsByRating = async (req, res) => {
  try {
    const min = Number(req.query.min);

    if (isNaN(min)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid rating",
      });
    }

    const products = await Product.find({
      rating: {
        $gt: min,
      },
    });

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  addProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
  getProductsByPrice,
  getProductsByRating,
};