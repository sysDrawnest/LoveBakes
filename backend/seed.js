/**
 * Seed script - populates MongoDB with sample products
 * Run: node seed.js
 */
import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import Product from './models/Product.js';

const PRODUCTS = [
    {
        name: 'Chocolate Dream Cake',
        description: 'Rich dark chocolate layers with silky ganache and whipped cream frosting. A celebration in every bite.',
        category: 'Cakes',
        images: ['https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600'],
        sizes: [{ size: '500g', price: 499 }, { size: '1kg', price: 899 }, { size: '2kg', price: 1699 }],
        flavors: ['Chocolate', 'Dark Chocolate'],
        isFeatured: true,
        isAvailable: true,
    },
    {
        name: 'Strawberry Bliss Cake',
        description: 'Layers of vanilla sponge with fresh strawberry compote and light whipped cream. Perfect for summer.',
        category: 'Cakes',
        images: ['https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600'],
        sizes: [{ size: '500g', price: 449 }, { size: '1kg', price: 849 }, { size: '2kg', price: 1599 }],
        flavors: ['Strawberry', 'Vanilla'],
        isFeatured: true,
        isAvailable: true,
    },
    {
        name: 'Red Velvet Romance',
        description: 'Classic red velvet with cream cheese frosting. Velvety texture, subtle cocoa, deeply indulgent.',
        category: 'Cakes',
        images: ['https://images.unsplash.com/photo-1559620192-032c4bc4674e?w=600'],
        sizes: [{ size: '500g', price: 549 }, { size: '1kg', price: 999 }, { size: '2kg', price: 1899 }],
        flavors: ['Red Velvet', 'Cream Cheese'],
        isFeatured: true,
        isAvailable: true,
    },
    {
        name: 'Butterscotch Delight Cake',
        description: 'Moist butterscotch sponge with caramel drip and pecan crumbles. Warmth in every slice.',
        category: 'Cakes',
        images: ['https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=600'],
        sizes: [{ size: '500g', price: 499 }, { size: '1kg', price: 899 }, { size: '2kg', price: 1699 }],
        flavors: ['Butterscotch', 'Caramel'],
        isFeatured: false,
        isAvailable: true,
    },
    {
        name: 'Assorted Cupcakes (6)',
        description: 'A box of 6 hand-decorated cupcakes — chocolate, vanilla, and strawberry. Perfect for gifting.',
        category: 'Cupcakes',
        images: ['https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=600'],
        sizes: [{ size: '500g', price: 349 }],
        flavors: ['Vanilla', 'Chocolate', 'Strawberry'],
        isFeatured: true,
        isAvailable: true,
    },
    {
        name: 'Croissant Butter',
        description: 'Flaky, golden French-style butter croissants baked fresh every morning.',
        category: 'Pastries',
        images: ['https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600'],
        sizes: [{ size: '500g', price: 249 }],
        flavors: ['Butter', 'Plain'],
        isFeatured: false,
        isAvailable: true,
    },
    {
        name: 'Choco Chip Cookies (12)',
        description: '12 soft-baked chocolate chip cookies — chewy centers, crispy edges, loaded with chips.',
        category: 'Cookies',
        images: ['https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=600'],
        sizes: [{ size: '500g', price: 299 }],
        flavors: ['Chocolate Chip'],
        isFeatured: false,
        isAvailable: true,
    },
    {
        name: 'Mango Passion Cheesecake',
        description: 'No-bake mango cheesecake on a buttery biscuit base. Tropical, tangy, delicious.',
        category: 'Desserts',
        images: ['https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600'],
        sizes: [{ size: '500g', price: 449 }, { size: '1kg', price: 849 }],
        flavors: ['Mango'],
        isFeatured: true,
        isAvailable: true,
    },
];

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB Atlas');
        await Product.deleteMany({});
        const inserted = await Product.insertMany(PRODUCTS);
        console.log(`✅ Seeded ${inserted.length} products!`);
        process.exit(0);
    } catch (err) {
        console.error('Seed error:', err.message);
        process.exit(1);
    }
};

seed();
