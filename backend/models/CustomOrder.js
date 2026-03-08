import mongoose from 'mongoose';

const customOrderSchema = mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        flavor: { type: String },
        size: { type: String },
        shape: { type: String },
        frosting: { type: String },
        icingColor: { type: String },
        toppings: [{ type: String }],
        message: { type: String },
        referenceImage: { type: String }, // URL to uploaded image
        deliveryDate: { type: Date, required: true },
        specialInstructions: { type: String },
        status: {
            type: String,
            enum: ['pending', 'quoted', 'approved', 'completed', 'cancelled'],
            default: 'pending',
        },
        quotedPrice: { type: Number },
    },
    { timestamps: true }
);

const CustomOrder = mongoose.model('CustomOrder', customOrderSchema);
export default CustomOrder;
