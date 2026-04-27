import prisma from '../config/prisma.js';
import asyncHandler from '../utils/asyncHandler.js';

// @desc    Get all products (with optional category filter & search)
// @route   GET /api/products
// @access  Public
export const getProducts = asyncHandler(async (req, res) => {
    const { category, search, page = 1, limit = 12 } = req.query;

    // Build the Prisma where clause
    const whereClause = { isAvailable: true };
    if (category && category !== 'All') {
        whereClause.category = category;
    }
    if (search) {
        whereClause.name = { contains: search, mode: 'insensitive' };
    }

    const count = await prisma.product.count({ where: whereClause });
    let products = await prisma.product.findMany({
        where: whereClause,
        take: Number(limit),
        skip: Number(limit) * (Number(page) - 1),
        orderBy: { createdAt: 'desc' }
    });

    // Re-map id to _id for frontend compatibility if necessary
    products = products.map(p => ({ ...p, _id: p.id }));

    res.json({ products, page: Number(page), pages: Math.ceil(count / limit), total: count });
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
export const getProductById = asyncHandler(async (req, res) => {
    const product = await prisma.product.findUnique({ where: { id: req.params.id } });
    if (product) {
        res.json({ ...product, _id: product.id });
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

// @desc    Get featured products (random selection of available products)
// @route   GET /api/products/featured
// @access  Public
export const getFeaturedProducts = asyncHandler(async (req, res) => {
    // Prisma does not have $sample, so we query a random selection using PostgreSQL RAW
    // Then map it. (Make sure id maps to _id for frontend)
    const rawProducts = await prisma.$queryRaw`SELECT * FROM "Product" WHERE "isAvailable" = true ORDER BY RANDOM() LIMIT 4`;

    const products = rawProducts.map(p => ({ ...p, _id: p.id }));
    res.json(products);
});

// @desc    Create product (admin)
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = asyncHandler(async (req, res) => {
    const { name, description, category, images, sizes, flavors, isAvailable } = req.body;

    // isFeatured wasn't in schema, ignored or you can add to JSON customizations.
    // The previous implementation used isFeatured which was likely ignored or implicit.
    const product = await prisma.product.create({
        data: {
            name,
            description,
            category,
            images: images || [],
            sizes: sizes || [],
            flavors: flavors || [],
            isAvailable: isAvailable !== undefined ? isAvailable : true
        }
    });
    res.status(201).json({ ...product, _id: product.id });
});

// @desc    Update product (admin)
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = asyncHandler(async (req, res) => {
    const productExists = await prisma.product.findUnique({ where: { id: req.params.id } });

    if (productExists) {
        const { deleteImages, existingImages, images: newImages, ...dataToUpdate } = req.body;

        let finalImages = productExists.images;

        // 1. Remove images requested for deletion
        if (deleteImages && Array.isArray(deleteImages)) {
            finalImages = finalImages.filter(img => !deleteImages.includes(img));
            // Note: In a real app, you'd also call Cloudinary here to delete them
        }

        // 2. If existingImages is provided, use it to maintain order/metadata (subset of current)
        if (existingImages && Array.isArray(existingImages)) {
            finalImages = existingImages;
        }

        // 3. Append new images if any
        if (newImages && Array.isArray(newImages)) {
            finalImages = [...finalImages, ...newImages];
        }

        const updated = await prisma.product.update({
            where: { id: req.params.id },
            data: {
                ...dataToUpdate,
                images: finalImages
            }
        });
        res.json({ ...updated, _id: updated.id });
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

// @desc    Delete product (admin)
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = asyncHandler(async (req, res) => {
    const productExists = await prisma.product.findUnique({ where: { id: req.params.id } });

    if (productExists) {
        await prisma.product.delete({ where: { id: req.params.id } });
        res.json({ message: 'Product removed' });
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});
