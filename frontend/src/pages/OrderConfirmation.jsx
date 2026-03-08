import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight } from 'lucide-react';

const OrderConfirmation = () => {
    const { state } = useLocation();
    const order = state?.order;

    return (
        <div className="max-w-xl mx-auto px-6 py-20 text-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', bounce: 0.5 }}>
                <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
            </motion.div>
            <h1 className="text-4xl font-bold text-[#4A332C] mb-4">Order Placed! 🎉</h1>
            <p className="text-[#4A332C]/70 mb-6">Thank you for ordering! We'll start baking right away. You'll receive a confirmation email shortly.</p>
            {order && (
                <div className="bg-[#FFF8F5] rounded-2xl p-6 text-left text-sm mb-8">
                    <p className="font-bold text-[#4A332C] mb-2">Order ID</p>
                    <p className="text-[#C8B6A6] font-mono">{order._id}</p>
                    <p className="font-bold text-[#4A332C] mt-4 mb-1">Total</p>
                    <p className="text-[#4A332C]">₹{order.totalPrice}</p>
                    <p className="font-bold text-[#4A332C] mt-4 mb-1">Delivery</p>
                    <p className="text-[#4A332C]">{new Date(order.deliveryDate).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    <p className="text-[#4A332C]">{order.deliveryTime}</p>
                </div>
            )}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/profile" className="inline-flex items-center justify-center gap-2 bg-[#4A332C] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#2C1A14]">
                    Track Order <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/shop" className="inline-flex items-center justify-center gap-2 border-2 border-[#4A332C] text-[#4A332C] px-6 py-3 rounded-full font-semibold hover:bg-[#4A332C] hover:text-white">
                    Keep Shopping
                </Link>
            </div>
        </div>
    );
};

export default OrderConfirmation;
