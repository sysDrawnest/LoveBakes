import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Heart, ArrowLeft, Star, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { getProductByIdApi } from '../api/api';
import { useCart } from '../context/CartContext';

/* ─── Mock data for reviews & suggestions (replace w/ API calls) ─── */
const MOCK_REVIEWS = [
    { id: 1, name: 'Priya S.', avatar: 'P', rating: 5, date: 'Feb 2025', text: 'Absolutely divine! The cake arrived perfectly and tasted even better than it looked. The fondant work was flawless.' },
    { id: 2, name: 'Arjun M.', avatar: 'A', rating: 5, date: 'Jan 2025', text: 'Ordered for my wife\'s birthday and she was in tears. The message was written so beautifully. Will order again!' },
    { id: 3, name: 'Neha R.', avatar: 'N', rating: 4, date: 'Jan 2025', text: 'Stunning presentation and delicious flavors. Delivery was prompt. Slightly smaller than expected but taste was 10/10.' },
    { id: 4, name: 'Kavya T.', avatar: 'K', rating: 5, date: 'Dec 2024', text: 'The Black Forest was incredibly moist and the cream was fresh. Every guest asked where we got it from!' },
];

const MOCK_SUGGESTIONS = [
    { id: 's1', name: 'Velvet Dream Cake', category: 'Signature', price: 849, image: 'https://images.unsplash.com/photo-1562440499-64916ea4bd4b?w=400&q=80' },
    { id: 's2', name: 'Berry Bliss Cake', category: 'Seasonal', price: 1099, image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&q=80' },
    { id: 's3', name: 'Choco Truffle Tower', category: 'Premium', price: 1399, image: 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=400&q=80' },
    { id: 's4', name: 'Caramel Drip Cake', category: 'Classic', price: 949, image: 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=400&q=80' },
];

/* ─── Sub-components ─── */
const StarRating = ({ rating, size = 14 }) => (
    <div style={{ display: 'flex', gap: 2 }}>
        {[1, 2, 3, 4, 5].map(i => (
            <Star key={i} size={size} fill={i <= rating ? '#F59E0B' : 'none'} color={i <= rating ? '#F59E0B' : '#D4C5B8'} />
        ))}
    </div>
);

const ReviewCard = ({ review, index }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.1 }}
        style={{
            background: 'white', borderRadius: 20, padding: '24px',
            border: '1px solid #F0E4DC',
            boxShadow: '0 4px 20px rgba(74,51,44,0.06)',
        }}
    >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 14 }}>
            <div style={{
                width: 42, height: 42, borderRadius: '50%', flexShrink: 0,
                background: 'linear-gradient(135deg, #E85D75, #C9416B)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 16, fontWeight: 700, color: 'white',
                fontFamily: "'Playfair Display', serif",
            }}>{review.avatar}</div>
            <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 700, color: '#3B2A25', fontSize: 14, fontFamily: "'DM Sans', sans-serif" }}>{review.name}</span>
                    <span style={{ fontSize: 11, color: '#C9A27E' }}>{review.date}</span>
                </div>
                <div style={{ marginTop: 4 }}>
                    <StarRating rating={review.rating} size={12} />
                </div>
            </div>
        </div>
        <p style={{ fontSize: 13.5, color: '#6B5147', lineHeight: 1.75, fontFamily: "'DM Sans', sans-serif", margin: 0 }}>{review.text}</p>
    </motion.div>
);

const SuggestionCard = ({ item, onClick }) => (
    <motion.div
        whileHover={{ y: -6, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        style={{
            background: 'white', borderRadius: 20, overflow: 'hidden',
            border: '1px solid #F0E4DC', cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(74,51,44,0.07)',
            transition: 'box-shadow 0.2s',
        }}
    >
        <div style={{ height: 160, overflow: 'hidden', position: 'relative' }}>
            <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }}
                onMouseEnter={e => e.target.style.transform = 'scale(1.08)'}
                onMouseLeave={e => e.target.style.transform = 'scale(1)'} />
            <div style={{
                position: 'absolute', top: 10, left: 10,
                background: 'rgba(255,245,239,0.92)', borderRadius: 50,
                padding: '3px 10px', fontSize: 10, fontWeight: 700, color: '#9B7560',
                letterSpacing: '0.1em', textTransform: 'uppercase',
                fontFamily: "'DM Sans', sans-serif",
            }}>{item.category}</div>
        </div>
        <div style={{ padding: '16px' }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, fontWeight: 600, color: '#3B2A25', marginBottom: 8 }}>{item.name}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 15, color: '#E85D75' }}>₹{item.price}</span>
                <motion.button
                    whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                    style={{
                        background: 'linear-gradient(135deg, #E85D75, #C9416B)', border: 'none',
                        borderRadius: '50%', width: 32, height: 32, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 4px 12px rgba(232,93,117,0.35)',
                    }}
                    onClick={e => { e.stopPropagation(); }}
                >
                    <ShoppingCart size={14} color="white" />
                </motion.button>
            </div>
        </div>
    </motion.div>
);

/* ─── Main Component ─── */
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
    const [wishlisted, setWishlisted] = useState(false);
    const [activeImg, setActiveImg] = useState(0);

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
        setTimeout(() => setAdded(false), 2500);
    };

    const selectedPrice = product?.sizes?.find(s => s.size === selectedSize)?.price || 0;
    const minDeliveryDate = new Date();
    minDeliveryDate.setDate(minDeliveryDate.getDate() + 1);
    const minDateStr = minDeliveryDate.toISOString().split('T')[0];
    const avgRating = (MOCK_REVIEWS.reduce((a, r) => a + r.rating, 0) / MOCK_REVIEWS.length).toFixed(1);

    const s = {
        label: { display: 'block', fontSize: 11, fontWeight: 700, color: '#9B7560', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.15em', fontFamily: "'DM Sans', sans-serif" },
        input: { width: '100%', border: '1.5px solid #E8D5C8', borderRadius: 14, padding: '13px 16px', color: '#3B2A25', fontSize: 14, fontFamily: "'DM Sans', sans-serif", background: '#FFFAF8', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s, box-shadow 0.2s' },
    };

    if (loading) return (
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '60px 24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48 }}>
            {[...Array(2)].map((_, i) => (
                <div key={i} style={{ borderRadius: 24, background: 'linear-gradient(90deg, #F5E8DF 25%, #FFF0E8 50%, #F5E8DF 75%)', backgroundSize: '200%', animation: 'shimmer 1.5s infinite', height: 420 }} />
            ))}
            <style>{`@keyframes shimmer { 0% { background-position: 200% 0 } 100% { background-position: -200% 0 } }`}</style>
        </div>
    );

    if (!product) return (
        <div style={{ textAlign: 'center', padding: '80px 20px', color: '#C9A27E', fontFamily: "'DM Sans', sans-serif" }}>
            Product not found
        </div>
    );

    const images = product.images?.length ? product.images : ['https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=700&q=80'];

    return (
        <div style={{ background: 'linear-gradient(160deg, #FFF7F2 0%, #FFF0F4 50%, #FFFAF0 100%)', minHeight: '100vh', paddingBottom: 80 }}>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        input:focus, select:focus, textarea:focus { border-color: #E85D75 !important; box-shadow: 0 0 0 4px rgba(232,93,117,0.1) !important; }
        select { appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%239B7560' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 14px center; padding-right: 36px !important; }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { display: none; }
      `}</style>

            <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 20px 0' }}>
                {/* Back */}
                <motion.button
                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                    onClick={() => navigate(-1)}
                    style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', color: '#9B7560', cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: "'DM Sans', sans-serif", padding: '8px 0', marginBottom: 28 }}
                >
                    <ArrowLeft size={16} /> Back to collection
                </motion.button>

                {/* ── PRODUCT HERO ── */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 48, marginBottom: 80 }}>

                    {/* Image Gallery */}
                    <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
                        <div style={{ position: 'relative', borderRadius: 28, overflow: 'hidden', aspectRatio: '1/1', boxShadow: '0 24px 80px rgba(74,51,44,0.18)' }}>
                            <AnimatePresence mode="wait">
                                <motion.img
                                    key={activeImg}
                                    initial={{ opacity: 0, scale: 1.05 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.35 }}
                                    src={images[activeImg]}
                                    alt={product.name}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                                />
                            </AnimatePresence>
                            {/* Wishlist */}
                            <motion.button
                                whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}
                                onClick={() => setWishlisted(w => !w)}
                                style={{
                                    position: 'absolute', top: 16, right: 16, width: 44, height: 44, borderRadius: '50%',
                                    background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)',
                                    border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                                }}
                            >
                                <Heart size={18} fill={wishlisted ? '#E85D75' : 'none'} color={wishlisted ? '#E85D75' : '#9B7560'} />
                            </motion.button>
                            {/* Nav arrows for multiple images */}
                            {images.length > 1 && (
                                <>
                                    <button onClick={() => setActiveImg(i => (i - 1 + images.length) % images.length)}
                                        style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.85)', border: 'none', borderRadius: '50%', width: 36, height: 36, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <ChevronLeft size={16} color="#3B2A25" />
                                    </button>
                                    <button onClick={() => setActiveImg(i => (i + 1) % images.length)}
                                        style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.85)', border: 'none', borderRadius: '50%', width: 36, height: 36, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <ChevronRight size={16} color="#3B2A25" />
                                    </button>
                                </>
                            )}
                            {/* Dot indicators */}
                            {images.length > 1 && (
                                <div style={{ position: 'absolute', bottom: 14, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 6 }}>
                                    {images.map((_, i) => (
                                        <div key={i} onClick={() => setActiveImg(i)} style={{ width: i === activeImg ? 20 : 6, height: 6, borderRadius: 3, background: i === activeImg ? '#E85D75' : 'rgba(255,255,255,0.6)', cursor: 'pointer', transition: 'all 0.3s' }} />
                                    ))}
                                </div>
                            )}
                        </div>
                        {/* Thumbnails */}
                        {images.length > 1 && (
                            <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
                                {images.map((img, i) => (
                                    <div key={i} onClick={() => setActiveImg(i)}
                                        style={{ width: 64, height: 64, borderRadius: 12, overflow: 'hidden', cursor: 'pointer', border: i === activeImg ? '2.5px solid #E85D75' : '2px solid transparent', transition: 'border 0.2s', flexShrink: 0 }}>
                                        <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </motion.div>

                    {/* Product Info & Order Form */}
                    <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} style={{ display: 'flex', flexDirection: 'column' }}>
                        {/* Category badge */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                            <span style={{
                                fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase',
                                color: '#E85D75', background: 'rgba(232,93,117,0.1)', padding: '4px 12px',
                                borderRadius: 50, fontFamily: "'DM Sans', sans-serif"
                            }}>{product.category}</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                                <StarRating rating={Math.round(avgRating)} size={12} />
                                <span style={{ fontSize: 12, color: '#9B7560', fontFamily: "'DM Sans', sans-serif" }}>({MOCK_REVIEWS.length} reviews)</span>
                            </div>
                        </div>

                        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(26px, 4vw, 38px)', color: '#3B2A25', lineHeight: 1.2, marginBottom: 12, fontWeight: 700 }}>{product.name}</h1>
                        <p style={{ color: '#8B6E63', fontSize: 15, lineHeight: 1.8, marginBottom: 24, fontFamily: "'DM Sans', sans-serif" }}>{product.description}</p>

                        {/* Price */}
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 28 }}>
                            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, fontWeight: 700, color: '#3B2A25' }}>₹{selectedPrice}</span>
                            <span style={{ fontSize: 13, color: '#C9A27E', fontFamily: "'DM Sans', sans-serif" }}>incl. taxes</span>
                        </div>

                        <div style={{ width: '100%', height: 1, background: 'linear-gradient(90deg, #F0D8CC, transparent)', marginBottom: 24 }} />

                        {/* Size */}
                        <div style={{ marginBottom: 22 }}>
                            <label style={s.label}>Choose Size</label>
                            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                                {product.sizes?.map(sz => (
                                    <motion.button
                                        key={sz.size} type="button"
                                        whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                                        onClick={() => setSelectedSize(sz.size)}
                                        style={{
                                            padding: '10px 20px', borderRadius: 50, fontSize: 13, fontWeight: 700,
                                            fontFamily: "'DM Sans', sans-serif", cursor: 'pointer', transition: 'all 0.2s',
                                            border: selectedSize === sz.size ? '2px solid #E85D75' : '2px solid #E8D5C8',
                                            background: selectedSize === sz.size ? 'linear-gradient(135deg, #E85D75, #C9416B)' : 'white',
                                            color: selectedSize === sz.size ? 'white' : '#9B7560',
                                            boxShadow: selectedSize === sz.size ? '0 4px 16px rgba(232,93,117,0.3)' : 'none',
                                        }}
                                    >{sz.size} · ₹{sz.price}</motion.button>
                                ))}
                            </div>
                        </div>

                        {/* Flavor */}
                        {product.flavors?.length > 0 && (
                            <div style={{ marginBottom: 22 }}>
                                <label style={s.label}>Flavor</label>
                                <select value={selectedFlavor} onChange={e => setSelectedFlavor(e.target.value)} style={s.input}>
                                    {product.flavors.map(f => <option key={f} value={f}>{f}</option>)}
                                </select>
                            </div>
                        )}

                        {/* Message */}
                        <div style={{ marginBottom: 22 }}>
                            <label style={s.label}>Message on Cake <span style={{ color: '#C9A27E', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(optional)</span></label>
                            <input type="text" value={message} onChange={e => setMessage(e.target.value)}
                                placeholder="e.g. Happy Birthday Priya! ❤️" maxLength={50} style={s.input} />
                        </div>

                        {/* Delivery Date */}
                        <div style={{ marginBottom: 28 }}>
                            <label style={s.label}>Delivery Date</label>
                            <input type="date" min={minDateStr} value={deliveryDate} onChange={e => setDeliveryDate(e.target.value)} style={s.input} />
                        </div>

                        {/* Quantity + Add to Cart */}
                        <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: 2,
                                background: '#F5EDE7', borderRadius: 50, padding: '4px',
                            }}>
                                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                    style={{ width: 36, height: 36, borderRadius: '50%', border: 'none', background: quantity > 1 ? 'white' : 'transparent', cursor: 'pointer', fontSize: 18, color: '#3B2A25', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: quantity > 1 ? '0 2px 8px rgba(0,0,0,0.08)' : 'none', transition: 'all 0.2s' }}>−</motion.button>
                                <span style={{ width: 36, textAlign: 'center', fontWeight: 700, fontSize: 16, color: '#3B2A25', fontFamily: "'DM Sans', sans-serif" }}>{quantity}</span>
                                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                                    onClick={() => setQuantity(q => q + 1)}
                                    style={{ width: 36, height: 36, borderRadius: '50%', border: 'none', background: 'white', cursor: 'pointer', fontSize: 18, color: '#3B2A25', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', transition: 'all 0.2s' }}>+</motion.button>
                            </div>

                            <motion.button
                                whileHover={!added ? { scale: 1.02, y: -2 } : {}}
                                whileTap={!added ? { scale: 0.97 } : {}}
                                onClick={handleAddToCart}
                                style={{
                                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                                    padding: '16px 24px', borderRadius: 18, border: 'none', cursor: 'pointer',
                                    fontSize: 15, fontWeight: 700, fontFamily: "'DM Sans', sans-serif",
                                    background: added ? 'linear-gradient(135deg, #22C55E, #16A34A)' : 'linear-gradient(135deg, #E85D75, #C9416B)',
                                    color: 'white', transition: 'background 0.3s',
                                    boxShadow: added ? '0 8px 30px rgba(34,197,94,0.4)' : '0 8px 30px rgba(232,93,117,0.4)',
                                }}
                            >
                                <AnimatePresence mode="wait">
                                    {added ? (
                                        <motion.span key="added" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                                            style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            ✓ Added to Cart!
                                        </motion.span>
                                    ) : (
                                        <motion.span key="add" initial={{ opacity: 1 }} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <ShoppingCart size={18} /> Add to Cart
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </motion.button>
                        </div>

                        {/* Trust badges */}
                        <div style={{ display: 'flex', gap: 20, marginTop: 24, paddingTop: 20, borderTop: '1px solid #F0D8CC' }}>
                            {[['🎂', 'Fresh daily'], ['🚚', 'Same-day delivery'], ['✨', 'Handcrafted']].map(([icon, text]) => (
                                <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                    <span style={{ fontSize: 16 }}>{icon}</span>
                                    <span style={{ fontSize: 11, color: '#9B7560', fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>{text}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* ── REVIEWS ── */}
                <div style={{ marginBottom: 80 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 24, marginBottom: 36 }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                                <Sparkles size={16} color="#E85D75" />
                                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9B7560', fontFamily: "'DM Sans', sans-serif" }}>Customer Reviews</span>
                            </div>
                            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: '#3B2A25', margin: 0 }}>What People Are Saying</h2>
                        </div>
                        <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 48, fontWeight: 700, color: '#3B2A25', lineHeight: 1 }}>{avgRating}</div>
                            <StarRating rating={5} size={14} />
                            <div style={{ fontSize: 12, color: '#C9A27E', marginTop: 4, fontFamily: "'DM Sans', sans-serif" }}>{MOCK_REVIEWS.length} reviews</div>
                        </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 18 }}>
                        {MOCK_REVIEWS.map((r, i) => <ReviewCard key={r.id} review={r} index={i} />)}
                    </div>
                </div>

                {/* ── SUGGESTIONS ── */}
                <div>
                    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 28 }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                                <Sparkles size={16} color="#E85D75" />
                                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9B7560', fontFamily: "'DM Sans', sans-serif" }}>You may also love</span>
                            </div>
                            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: '#3B2A25', margin: 0 }}>More Delights</h2>
                        </div>
                        <motion.button
                            whileHover={{ x: 4 }} onClick={() => navigate('/products')}
                            style={{ background: 'none', border: 'none', color: '#E85D75', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontFamily: "'DM Sans', sans-serif" }}>
                            View all <ChevronRight size={16} />
                        </motion.button>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 20 }}>
                        {MOCK_SUGGESTIONS.map(item => (
                            <SuggestionCard key={item.id} item={item} onClick={() => navigate(`/products/${item.id}`)} />
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ProductDetail;
