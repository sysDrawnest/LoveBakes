import mongoose from 'mongoose';

const orderSchema = mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        items: [
            {
                product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
                size: { type: String },
                quantity: { type: Number, required: true },
                price: { type: Number, required: true },
                message: { type: String }, // For writing on cake
                customizations: { type: Object },
            },
        ],
        totalPrice: { type: Number, required: true },
        deliveryAddress: {
            name: { type: String, required: true },
            phone: { type: String, required: true },
            street: { type: String, required: true },
            city: { type: String, required: true },
            state: { type: String, required: true },
            zip: { type: String, required: true },
        },
        deliveryDate: { type: Date, required: true },
        deliveryTime: { type: String, required: true },
        paymentMethod: { type: String, enum: ['cod', 'online'], required: true },
        paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
        orderStatus: {
            type: String,
            enum: ['pending', 'accepted', 'preparing', 'out for delivery', 'delivered', 'cancelled'],
            default: 'pending',
        },
    },
    { timestamps: true }
);

const Order = mongoose.model('Order', orderSchema);
export default Order;
