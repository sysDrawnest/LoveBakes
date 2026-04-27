import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ShoppingCart, ChevronLeft, ChevronRight, ArrowRight, Sparkles } from 'lucide-react';
import { getProductsApi, getFeaturedProductsApi } from '../api/api';
import { useCart } from '../context/CartContext';

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORIES = [
    { label: 'Cakes', api: 'Cakes', badge: null },
    { label: 'Cupcakes', api: 'Cupcakes', badge: 'New' },
    { label: 'Pastries', api: 'Pastries', badge: null },
    { label: 'Sugar-Free', api: 'Sugar-Free Cakes', badge: 'Sugar-Free' },
    { label: 'Can Cakes', api: 'Can Cakes', badge: 'New' },
    { label: 'Cartoon Cakes', api: 'Cartoon Cakes', badge: null },
    { label: 'Name Cakes', api: 'Name Cakes', badge: null },
    { label: 'Cookies', api: 'Cookies', badge: null },
];

// Placeholder products shown while loading or when DB is empty
const makePlaceholders = (category) => [1, 2, 3, 4, 5, 6, 7, 8].map(i => ({
    _id: `ph-${category}-${i}`,
    name: ['Chocolate Truffle Cake', 'Strawberry Delight', 'Red Velvet Slice', 'Mango Cloud', 'Blueberry Bliss', 'Caramel Dream', 'Vanilla Swirl', 'Black Forest'][i - 1],
    category,
    description: 'Handcrafted with premium ingredients and baked fresh every morning with love.',
    images: [
        'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&q=80',
        'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=600&q=80',
        'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=600&q=80',
        'https://images.unsplash.com/photo-1535141192574-5d4897c12636?w=600&q=80',
        'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&q=80',
        'https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=600&q=80',
        'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=600&q=80',
        'https://images.unsplash.com/photo-1606313564200-e75d5e3047f1?w=600&q=80',
    ][i - 1],
    sizes: [{ size: '1kg', price: [1200, 850, 950, 1100, 750, 1350, 900, 650][i - 1] }],
    rating: 4.5 + (i % 2) * 0.4,
    reviewCount: [124, 89, 203, 67, 145, 92, 178, 56][i - 1],
    isPlaceholder: true,
}));

// ─── Badge helper ──────────────────────────────────────────────────────────────

const getBadge = (product, categoryBadge) => {
    if (product.category?.toLowerCase().includes('sugar')) return { label: 'Sugar-Free', color: 'bg-emerald-100 text-emerald-700' };
    if (categoryBadge === 'New') return { label: 'New', color: 'bg-blue-100 text-blue-700' };
    if (product.isFeatured || product.isPlaceholder) return { label: 'Bestseller', color: 'bg-[#E85D75]/10 text-[#E85D75]' };
    return null;
};

// ─── ShowcaseProductCard ───────────────────────────────────────────────────────

const ShowcaseProductCard = ({ product, badge }) => {
    const { addToCart } = useCart();
    const defaultSize = product.sizes?.[0];
    const rating = product.rating || 4.7;
    const reviewCount = product.reviewCount || 120;
    const cardBadge = getBadge(product, badge);

    return (
        <motion.div
            whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(59,42,37,0.14)' }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="group bg-white rounded-3xl overflow-hidden shadow-[0_4px_20px_rgba(59,42,37,0.07)] flex flex-col"
        >
            {/* Image */}
            <Link to={`/product/${product._id}`} className="relative block overflow-hidden h-52 md:h-56 bg-[#F5EDE8] shrink-0">
                <img
                    src={product.images?.[0] || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&q=80'}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
                    loading="lazy"
                />
                {/* Warm overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#3B2A25]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
                {/* Badge */}
                {cardBadge && (
                    <span className={`absolute top-3 left-3 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${cardBadge.color}`}>
                        {cardBadge.label}
                    </span>
                )}
            </Link>

            {/* Info */}
            <div className="p-4 flex flex-col flex-1">
                <span className="text-[10px] font-semibold text-[#C9A27E] uppercase tracking-widest">{product.category}</span>
                <h3 className="font-bold text-[#3B2A25] text-sm mt-1 leading-snug line-clamp-2">{product.name}</h3>
                <p className="text-xs text-[#3B2A25]/55 mt-1.5 line-clamp-2 leading-relaxed flex-1">{product.description}</p>

                {/* Stars */}
                <div className="flex items-center gap-1 mt-2.5">
                    <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map(s => (
                            <Star key={s} className={`w-3 h-3 ${s <= Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-200 fill-gray-200'}`} />
                        ))}
                    </div>
                    <span className="text-[10px] text-[#3B2A25]/50 ml-1">({reviewCount})</span>
                </div>

                {/* Price + Cart */}
                <div className="flex items-center justify-between mt-3">
                    <div>
                        <span className="text-base font-extrabold text-[#3B2A25]">₹{defaultSize?.price}</span>
                        <span className="text-[10px] text-[#C9A27E] ml-1">/ {defaultSize?.size}</span>
                    </div>
                    <motion.button
                        whileTap={{ scale: 0.92 }}
                        onClick={() => addToCart(product, defaultSize?.size)}
                        className="flex items-center gap-1.5 bg-[#E85D75] text-white text-xs font-bold px-3.5 py-2 rounded-full hover:bg-[#D94C65] transition-colors shadow-sm group-hover:shadow-[0_4px_14px_rgba(232,93,117,0.35)]"
                    >
                        <ShoppingCart className="w-3 h-3" />
                        Add
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
};

// ─── CarouselCard ──────────────────────────────────────────────────────────────

const CarouselCard = ({ product }) => {
    const { addToCart } = useCart();
    const defaultSize = product.sizes?.[0];
    const rating = product.rating || 4.8;
    const cardBadge = getBadge(product, 'Bestseller');

    return (
        <motion.div
            whileHover={{ y: -8 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="group relative flex-shrink-0 w-64 md:w-72 bg-white rounded-3xl overflow-hidden shadow-[0_8px_32px_rgba(59,42,37,0.10)] flex flex-col"
        >
            {/* Image */}
            <Link to={`/product/${product._id}`} className="relative block overflow-hidden h-52 bg-[#F5EDE8] shrink-0">
                <img
                    src={product.images?.[0] || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&q=80'}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#3B2A25]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                {cardBadge && (
                    <span className={`absolute top-3 left-3 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${cardBadge.color}`}>
                        {cardBadge.label}
                    </span>
                )}
            </Link>

            {/* Info */}
            <div className="p-5 flex flex-col flex-1">
                <h3 className="font-bold text-[#3B2A25] text-base leading-snug line-clamp-1">{product.name}</h3>
                <p className="text-xs text-[#3B2A25]/55 mt-1.5 line-clamp-2 leading-relaxed flex-1">{product.description}</p>

                {/* Stars */}
                <div className="flex items-center gap-1 mt-3">
                    {[1, 2, 3, 4, 5].map(s => (
                        <Star key={s} className={`w-3.5 h-3.5 ${s <= Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-200 fill-gray-200'}`} />
                    ))}
                    <span className="text-[10px] text-[#3B2A25]/50 ml-1">{rating.toFixed(1)}</span>
                </div>

                {/* Price + Cart */}
                <div className="flex items-center justify-between mt-4">
                    <div>
                        <span className="text-xl font-extrabold text-[#3B2A25]">₹{defaultSize?.price}</span>
                        <span className="text-xs text-[#C9A27E] ml-1">/ {defaultSize?.size}</span>
                    </div>
                    <motion.button
                        whileTap={{ scale: 0.92 }}
                        onClick={() => addToCart(product, defaultSize?.size)}
                        className="flex items-center gap-1.5 bg-[#E85D75] text-white text-sm font-bold px-4 py-2.5 rounded-full hover:bg-[#D94C65] transition-all shadow-sm hover:shadow-[0_4px_16px_rgba(232,93,117,0.4)]"
                    >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        Add to Cart
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
};

// ─── Main Section ──────────────────────────────────────────────────────────────

const ProductShowcase = () => {
    const [featured, setFeatured] = useState([]);
    const [activeTab, setActiveTab] = useState(0);
    const [categoryProducts, setCategoryProducts] = useState({});
    const [loadingCategory, setLoadingCategory] = useState(false);
    const carouselRef = useRef(null);
    const navigate = useNavigate();

    // Load featured/bestseller carousel
    useEffect(() => {
        getFeaturedProductsApi()
            .then(r => {
                const products = Array.isArray(r.data) ? r.data : (r.data?.products || r.data?.data || []);
                if (products.length > 0) {
                    setFeatured(products);
                } else {
                    setFeatured(makePlaceholders('Cakes').slice(0, 6));
                }
            })
            .catch(() => setFeatured(makePlaceholders('Cakes').slice(0, 6)));
    }, []);

    // Load category products on tab switch
    const loadCategory = useCallback(async (tabIndex) => {
        const cat = CATEGORIES[tabIndex];
        if (categoryProducts[cat.api]) return; // already cached
        setLoadingCategory(true);
        try {
            const r = await getProductsApi({ category: cat.api, limit: 8 });
            const products = r.data?.products || r.data?.data || (Array.isArray(r.data) ? r.data : []);
            setCategoryProducts(prev => ({
                ...prev,
                [cat.api]: products.length > 0 ? products : makePlaceholders(cat.api),
            }));
        } catch {
            setCategoryProducts(prev => ({ ...prev, [cat.api]: makePlaceholders(cat.api) }));
        } finally {
            setLoadingCategory(false);
        }
    }, [categoryProducts]);

    useEffect(() => {
        loadCategory(activeTab);
    }, [activeTab]);

    // Carousel navigation
    const scrollCarousel = (direction) => {
        if (!carouselRef.current) return;
        carouselRef.current.scrollBy({ left: direction * 300, behavior: 'smooth' });
    };

    const currentCategory = CATEGORIES[activeTab];
    const currentProducts = categoryProducts[currentCategory.api] || [];

    return (
        <section className="relative w-full overflow-hidden bg-[#FAF6F0] py-4">

            {/* ── Decorative background ──────────────────────────── */}
            <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
                {/* Soft radial glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-[#E85D75]/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-40 right-0 w-[600px] h-[400px] bg-[#C9A27E]/8 rounded-full blur-[100px]" />
                {/* Subtle dot pattern */}
                <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
                    <pattern id="dots" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
                        <circle cx="2" cy="2" r="1.5" fill="#3B2A25" />
                    </pattern>
                    <rect width="100%" height="100%" fill="url(#dots)" />
                </svg>
            </div>

            {/* ── Section Header ─────────────────────────────────── */}
            <div className="relative z-10 text-center px-6 pt-16 pb-6 max-w-2xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                >
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C9A27E] uppercase tracking-[0.2em] mb-3">
                        <Sparkles className="w-3.5 h-3.5" />
                        Freshly Baked Daily
                    </span>
                    <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#3B2A25] leading-tight">
                        Our Bestsellers
                    </h2>
                    <p className="mt-3 text-[#3B2A25]/60 text-base md:text-lg leading-relaxed">
                        Freshly baked favorites loved by our customers
                    </p>
                    {/* Decorative divider */}
                    <div className="flex items-center justify-center gap-3 mt-5">
                        <span className="h-px w-16 bg-[#C9A27E]/40" />
                        <span className="text-[#C9A27E] text-xl">✦</span>
                        <span className="h-px w-16 bg-[#C9A27E]/40" />
                    </div>
                </motion.div>
            </div>

            {/* ── Featured Carousel ───────────────────────────────── */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 mt-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="relative"
                >
                    {/* Left Arrow */}
                    <button
                        onClick={() => scrollCarousel(-1)}
                        className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20 w-11 h-11 bg-white rounded-full shadow-lg items-center justify-center text-[#3B2A25] hover:bg-[#3B2A25] hover:text-white transition-all duration-200 hover:scale-110"
                        aria-label="Scroll left"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>

                    {/* Carousel track */}
                    <div
                        ref={carouselRef}
                        className="flex gap-5 overflow-x-auto pb-6 scroll-smooth no-scrollbar snap-x snap-mandatory px-1"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {featured.map((product, i) => (
                            <motion.div
                                key={product._id}
                                initial={{ opacity: 0, x: 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: i * 0.08 }}
                                className="snap-start"
                            >
                                <CarouselCard product={product} />
                            </motion.div>
                        ))}
                    </div>

                    {/* Right Arrow */}
                    <button
                        onClick={() => scrollCarousel(1)}
                        className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20 w-11 h-11 bg-white rounded-full shadow-lg items-center justify-center text-[#3B2A25] hover:bg-[#3B2A25] hover:text-white transition-all duration-200 hover:scale-110"
                        aria-label="Scroll right"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </motion.div>
            </div>

            {/* ── Category Tabs + Grid ────────────────────────────── */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 mt-16">

                {/* Tab navigation */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="flex gap-2 overflow-x-auto pb-2 no-scrollbar"
                    style={{ scrollbarWidth: 'none' }}
                >
                    {CATEGORIES.map((cat, i) => (
                        <button
                            key={cat.label}
                            onClick={() => setActiveTab(i)}
                            className={`flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-250 whitespace-nowrap border ${activeTab === i
                                    ? 'bg-[#3B2A25] text-white border-[#3B2A25] shadow-md'
                                    : 'bg-white text-[#3B2A25]/70 border-[#3B2A25]/15 hover:border-[#3B2A25]/40 hover:text-[#3B2A25]'
                                }`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </motion.div>

                {/* Product grid */}
                <div className="mt-8 min-h-[380px]">
                    <AnimatePresence mode="wait">
                        {loadingCategory ? (
                            <motion.div
                                key="loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
                            >
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="rounded-3xl bg-white overflow-hidden shadow-[0_4px_20px_rgba(59,42,37,0.06)] animate-pulse">
                                        <div className="h-52 bg-[#F5EDE8]" />
                                        <div className="p-4 space-y-3">
                                            <div className="h-3 bg-[#E8D5C4] rounded-full w-1/2" />
                                            <div className="h-4 bg-[#E8D5C4] rounded-full w-3/4" />
                                            <div className="h-3 bg-[#E8D5C4] rounded-full" />
                                            <div className="h-3 bg-[#E8D5C4] rounded-full w-5/6" />
                                        </div>
                                    </div>
                                ))}
                            </motion.div>
                        ) : (
                            <motion.div
                                key={currentCategory.api}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -12 }}
                                transition={{ duration: 0.35, ease: 'easeOut' }}
                                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
                            >
                                {currentProducts.slice(0, 8).map((product, i) => (
                                    <motion.div
                                        key={product._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4, delay: i * 0.06 }}
                                    >
                                        <ShowcaseProductCard product={product} badge={currentCategory.badge} />
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* View More link */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="flex justify-center mt-10"
                >
                    <Link
                        to={`/shop?category=${encodeURIComponent(currentCategory.api)}`}
                        className="inline-flex items-center gap-2 text-[#3B2A25] font-semibold text-sm border-b-2 border-[#3B2A25]/30 pb-0.5 hover:border-[#3B2A25] hover:gap-4 transition-all duration-200"
                    >
                        Explore Full {currentCategory.label} Menu
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </motion.div>
            </div>

            {/* ── Custom Cake CTA ─────────────────────────────────── */}
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="relative z-10 mx-4 md:mx-8 lg:mx-auto max-w-5xl mt-20 mb-6"
            >
                <div className="relative bg-[#3B2A25] rounded-[2.5rem] overflow-hidden px-10 py-14 md:py-16 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
                    {/* Subtle image tint */}
                    <div className="absolute inset-0 opacity-[0.08]">
                        <img
                            src="https://images.unsplash.com/photo-1621236378699-8597faf6a176?w=1200&q=60"
                            className="w-full h-full object-cover"
                            alt=""
                        />
                    </div>
                    {/* Radial glow */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#E85D75]/20 rounded-full blur-[80px]" />

                    {/* Text */}
                    <div className="relative z-10">
                        <span className="inline-flex items-center gap-1.5 text-[#C9A27E] text-xs font-bold uppercase tracking-[0.2em] mb-3">
                            <Sparkles className="w-3.5 h-3.5" />
                            Made Just For You
                        </span>
                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-white leading-tight">
                            Design Your Custom Cake
                        </h2>
                        <p className="text-[#C9A27E] mt-3 text-base max-w-md leading-relaxed">
                            Choose every detail — flavour, size, frosting, toppings. We'll bake it exactly as you imagined.
                        </p>
                    </div>

                    {/* Button */}
                    <div className="relative z-10 shrink-0">
                        <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                            <Link
                                to="/custom-cake"
                                className="inline-flex items-center gap-2.5 bg-[#E85D75] text-white px-8 py-4 rounded-full text-base font-bold shadow-[0_8px_30px_rgba(232,93,117,0.4)] hover:bg-white hover:text-[#E85D75] transition-all duration-250"
                            >
                                Design Your Custom Cake
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </motion.div>

        </section>
    );
};

export default ProductShowcase;
