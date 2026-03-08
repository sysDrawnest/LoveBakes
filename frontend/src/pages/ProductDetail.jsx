import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, ArrowLeft } from 'lucide-react';
import { getProductByIdApi } from '../api/api';
import { useCart } from '../context/CartContext';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedFlavor, setSelectedFlavor] = useState('');
    const [message, setMessage] = useState('');
    const [deliveryDate, setDeliveryDate] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [added, setAdded] = useState(false);

    useEffect(() => {
        getProductByIdApi(id)
            .then(r => {
                setProduct(r.data);
                setSelectedSize(r.data.sizes?.[0]?.size || '');
                setSelectedFlavor(r.data.flavors?.[0] || '');
            })
            .catch(() => { })
            .finally(() => setLoading(false));
    }, [id]);

    const handleAddToCart = () => {
        addToCart(product, selectedSize, quantity, message);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    const selectedPrice = product?.sizes?.find(s => s.size === selectedSize)?.price || 0;
    const minDeliveryDate = new Date();
    minDeliveryDate.setDate(minDeliveryDate.getDate() + 1);
    const minDateStr = minDeliveryDate.toISOString().split('T')[0];

    if (loading) return (
        <div className="max-w-6xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-2 gap-12 animate-pulse">
            <div className="aspect-square bg-[#F1DEC9]/40 rounded-3xl" />
            <div className="space-y-4">
                <div className="h-6 bg-[#F1DEC9] rounded w-1/3" />
                <div className="h-8 bg-[#F1DEC9] rounded w-3/4" />
                <div className="h-4 bg-[#F1DEC9] rounded" />
            </div>
        </div>
    );

    if (!product) return <div className="text-center py-20 text-[#C8B6A6]">Product not found</div>;

    return (
        <div className="max-w-6xl mx-auto px-4 py-10">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[#C8B6A6] mb-8 hover:text-[#4A332C] transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Image */}
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="rounded-3xl overflow-hidden shadow-lg aspect-square bg-[#F1DEC9]/20">
                    <img
                        src={product.images?.[0] || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600'}
                        alt={product.name}
                        className="w-full h-full object-cover"
                    />
                </motion.div>

                {/* Details */}
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col justify-center">
                    <span className="text-sm font-semibold text-[#C8B6A6] uppercase tracking-wider">{product.category}</span>
                    <h1 className="text-4xl font-bold text-[#4A332C] mt-2 mb-4">{product.name}</h1>
                    <p className="text-[#4A332C]/70 leading-relaxed mb-6">{product.description}</p>

                    {/* Price */}
                    <div className="text-3xl font-bold text-[#4A332C] mb-6">₹{selectedPrice}</div>

                    {/* Size Selector */}
                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-[#4A332C] mb-2">Select Size</label>
                        <div className="flex gap-3 flex-wrap">
                            {product.sizes?.map(s => (
                                <button
                                    key={s.size}
                                    onClick={() => setSelectedSize(s.size)}
                                    className={`px-5 py-2.5 rounded-full border-2 text-sm font-semibold transition-all ${selectedSize === s.size
                                            ? 'border-[#4A332C] bg-[#4A332C] text-white'
                                            : 'border-[#F1DEC9] text-[#4A332C] hover:border-[#4A332C]/50'
                                        }`}
                                >
                                    {s.size} — ₹{s.price}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Flavor Selector */}
                    {product.flavors?.length > 0 && (
                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-[#4A332C] mb-2">Flavor</label>
                            <select
                                value={selectedFlavor}
                                onChange={e => setSelectedFlavor(e.target.value)}
                                className="w-full border border-[#F1DEC9] rounded-xl px-4 py-3 text-[#4A332C] focus:outline-none focus:ring-2 focus:ring-[#4A332C]/20"
                            >
                                {product.flavors.map(f => <option key={f} value={f}>{f}</option>)}
                            </select>
                        </div>
                    )}

                    {/* Message */}
                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-[#4A332C] mb-2">Message on Cake (optional)</label>
                        <input
                            type="text"
                            value={message}
                            onChange={e => setMessage(e.target.value)}
                            placeholder="e.g. Happy Birthday Priya! ❤️"
                            maxLength={50}
                            className="w-full border border-[#F1DEC9] rounded-xl px-4 py-3 text-[#4A332C] focus:outline-none focus:ring-2 focus:ring-[#4A332C]/20"
                        />
                    </div>

                    {/* Delivery Date */}
                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-[#4A332C] mb-2">Delivery Date</label>
                        <input
                            type="date"
                            min={minDateStr}
                            value={deliveryDate}
                            onChange={e => setDeliveryDate(e.target.value)}
                            className="w-full border border-[#F1DEC9] rounded-xl px-4 py-3 text-[#4A332C] focus:outline-none"
                        />
                    </div>

                    {/* Quantity & Add to Cart */}
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3 bg-[#F1DEC9]/40 rounded-full px-2 py-1">
                            <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-8 h-8 flex items-center justify-center text-[#4A332C] font-bold rounded-full hover:bg-[#F1DEC9]">−</button>
                            <span className="w-8 text-center font-bold text-[#4A332C]">{quantity}</span>
                            <button onClick={() => setQuantity(q => q + 1)} className="w-8 h-8 flex items-center justify-center text-[#4A332C] font-bold rounded-full hover:bg-[#F1DEC9]">+</button>
                        </div>
                        <button
                            onClick={handleAddToCart}
                            className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-full text-base font-bold transition-all ${added ? 'bg-green-500 text-white' : 'bg-[#4A332C] text-white hover:bg-[#2C1A14]'
                                }`}
                        >
                            <ShoppingCart className="w-5 h-5" />
                            {added ? 'Added! ✓' : 'Add to Cart'}
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default ProductDetail;
