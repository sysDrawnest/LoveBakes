import Product from '../models/Product.js';
import asyncHandler from '../utils/asyncHandler.js';

// @desc    Get all products (with optional category filter & search)
// @route   GET /api/products
// @access  Public
export const getProducts = asyncHandler(async (req, res) => {
    const { category, search, page = 1, limit = 12 } = req.query;
    const query = { isAvailable: true };
    if (category && category !== 'All') query.category = category;
    if (search) query.name = { $regex: search, $options: 'i' };

    const count = await Product.countDocuments(query);
    const products = await Product.find(query)
        .limit(Number(limit))
        .skip(Number(limit) * (Number(page) - 1))
        .sort({ createdAt: -1 });

    res.json({ products, page: Number(page), pages: Math.ceil(count / limit), total: count });
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
export const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) res.json(product);
    else { res.status(404); throw new Error('Product not found'); }
});

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
export const getFeaturedProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({ isFeatured: true, isAvailable: true }).limit(6);
    res.json(products);
});

// @desc    Create product (admin)
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = asyncHandler(async (req, res) => {
    const { name, description, category, images, sizes, flavors, isFeatured } = req.body;
    const product = await Product.create({ name, description, category, images, sizes, flavors, isFeatured });
    res.status(201).json(product);
});

// @desc    Update product (admin)
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
        Object.assign(product, req.body);
        const updated = await product.save();
        res.json(updated);
    } else { res.status(404); throw new Error('Product not found'); }
});

// @desc    Delete product (admin)
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
        await product.deleteOne();
        res.json({ message: 'Product removed' });
    } else { res.status(404); throw new Error('Product not found'); }
});
