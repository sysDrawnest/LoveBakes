import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Cart = () => {
    const { cartItems, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
    const navigate = useNavigate();
    const DELIVERY_FEE = cartTotal > 0 ? 50 : 0;

    if (cartItems.length === 0) return (
        <div className="max-w-xl mx-auto px-6 py-24 text-center">
            <div className="text-7xl mb-6">🛒</div>
            <h2 className="text-3xl font-bold text-[#3B2A25] mb-4">Your cart is empty</h2>
            <p className="text-[#C9A27E] mb-8">Add some delicious items from our menu!</p>
            <Link to="/shop" className="inline-flex items-center gap-2 bg-[#E85D75] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#D94C65]">
                Browse Menu <ArrowRight className="w-4 h-4" />
            </Link>
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto px-4 py-12">
            <h1 className="text-4xl font-bold text-[#3B2A25] mb-10">Your Cart 🛒</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="md:col-span-2 space-y-4">
                    <AnimatePresence>
                        {cartItems.map(item => (
                            <motion.div
                                key={item.key}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                className="bg-white rounded-2xl p-4 flex gap-4 shadow-[0_4px_20px_rgba(74,51,44,0.06)]"
                            >
                                <img
                                    src={item.image || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=200'}
                                    alt={item.name}
                                    className="w-20 h-20 object-cover rounded-xl"
                                />
                                <div className="flex-1">
                                    <h3 className="font-bold text-[#3B2A25]">{item.name}</h3>
                                    <p className="text-xs text-[#C9A27E] mb-2">{item.size} {item.message && `• "${item.message}"`}</p>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 bg-[#C9A27E]/40 rounded-full px-1 py-0.5">
                                            <button onClick={() => updateQuantity(item.key, item.quantity - 1)} className="w-7 h-7 flex items-center justify-center font-bold text-[#3B2A25] hover:bg-[#C9A27E] rounded-full">−</button>
                                            <span className="w-6 text-center text-sm font-bold text-[#3B2A25]">{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.key, item.quantity + 1)} className="w-7 h-7 flex items-center justify-center font-bold text-[#3B2A25] hover:bg-[#C9A27E] rounded-full">+</button>
                                        </div>
                                        <span className="font-bold text-[#3B2A25]">₹{item.price * item.quantity}</span>
                                        <button onClick={() => removeFromCart(item.key)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Order Summary */}
                <div className="md:col-span-1">
                    <div className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgba(74,51,44,0.06)] sticky top-20">
                        <h3 className="font-bold text-xl text-[#3B2A25] mb-5">Order Summary</h3>
                        <div className="space-y-3 text-sm text-[#3B2A25]/80">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>₹{cartTotal}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Delivery</span>
                                <span>₹{DELIVERY_FEE}</span>
                            </div>
                            <div className="border-t border-[#C9A27E] pt-3 flex justify-between font-bold text-base text-[#3B2A25]">
                                <span>Total</span>
                                <span>₹{cartTotal + DELIVERY_FEE}</span>
                            </div>
                        </div>
                        <button
                            onClick={() => navigate('/checkout')}
                            className="w-full mt-6 flex items-center justify-center gap-2 bg-[#E85D75] text-white py-3.5 rounded-full font-bold hover:bg-[#D94C65] transition-colors"
                        >
                            Checkout <ArrowRight className="w-4 h-4" />
                        </button>
                        <Link to="/shop" className="block text-center text-sm text-[#C9A27E] mt-3 hover:text-[#3B2A25]">
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
