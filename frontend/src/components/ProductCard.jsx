import { Link } from 'react-router-dom';
import { ShoppingCart, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();
    const defaultSize = product.sizes?.[0];

    return (
        <motion.div
            whileHover={{ y: -4 }}
            className="bg-white rounded-3xl overflow-hidden shadow-[0_4px_24px_rgba(74,51,44,0.08)] group"
        >
            {/* Image */}
            <Link to={`/product/${product._id}`} className="block overflow-hidden h-52 bg-[#C9A27E]/30">
                <img
                    src={product.images?.[0] || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400'}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                />
            </Link>

            {/* Info */}
            <div className="p-4">
                <span className="text-xs text-[#C9A27E] font-medium uppercase tracking-wider">{product.category}</span>
                <h3 className="font-bold text-[#3B2A25] text-base mt-1 line-clamp-1">{product.name}</h3>
                <p className="text-sm text-[#3B2A25]/60 mt-1 line-clamp-2">{product.description}</p>

                <div className="flex items-center justify-between mt-3">
                    <div>
                        <span className="text-lg font-bold text-[#3B2A25]">₹{defaultSize?.price}</span>
                        <span className="text-xs text-[#C9A27E] ml-1">/ {defaultSize?.size}</span>
                    </div>
                    <button
                        onClick={() => addToCart(product, defaultSize?.size)}
                        className="flex items-center gap-1.5 bg-[#E85D75] text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-[#D94C65] transition-colors"
                    >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        Add
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default ProductCard;
