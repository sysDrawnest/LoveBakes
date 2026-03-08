import mongoose from 'mongoose';

const productSchema = mongoose.Schema(
    {
        name: { type: String, required: true },
        description: { type: String },
        category: {
            type: String,
            enum: ['Cakes', 'Custom Cakes', 'Pastries', 'Cookies', 'Cupcakes', 'Desserts'],
            required: true,
        },
        images: [{ type: String }],
        sizes: [
            {
                size: { type: String, enum: ['500g', '1kg', '2kg'] },
                price: { type: Number },
            },
        ],
        flavors: [{ type: String }],
        isAvailable: { type: Boolean, default: true },
    },
    { timestamps: true }
);

const Product = mongoose.model('Product', productSchema);
export default Product;
