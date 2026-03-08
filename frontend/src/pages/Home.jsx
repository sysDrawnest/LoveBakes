import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Instagram, MapPin, MessageCircle, Phone } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getFeaturedProductsApi } from '../api/api';
import ProductCard from '../components/ProductCard';

const TESTIMONIALS = [
    { name: 'Priya S.', review: 'The chocolate cake was absolutely divine! Every bite felt like a warm hug. Will order again!', rating: 5 },
    { name: 'Rahul M.', review: 'Got a custom cake for my girlfriend\'s birthday. It was perfect, beautiful, and delicious!', rating: 5 },
    { name: 'Ananya B.', review: 'LoveBakes cupcakes are the best I\'ve ever had. The frosting is out of this world.', rating: 5 },
];

const INSTAGRAM_POSTS = [
    'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?w=300&h=300&fit=crop',
];

const Home = () => {
    const [featured, setFeatured] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        getFeaturedProductsApi().then(r => setFeatured(r.data)).catch(() => { });
    }, []);

    return (
        <div className="w-full">
            {/* ── HERO ─────────────────────────────────────── */}
            <section className="relative min-h-[88vh] flex items-center overflow-hidden bg-[#FFF8F5]">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center py-20">
                    {/* Text */}
                    <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
                        <span className="inline-block text-sm font-semibold text-[#C8B6A6] tracking-widest uppercase mb-4">Handmade with Heart ❤️</span>
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-[#4A332C] leading-tight">
                            Baked<br />With<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4A332C] to-[#C8B6A6]">Love.</span>
                        </h1>
                        <p className="mt-6 text-lg text-[#4A332C]/70 max-w-md leading-relaxed">
                            Homemade cakes, pastries and desserts crafted with premium ingredients and a whole lot of love. From our cozy kitchen to your celebration.
                        </p>
                        <div className="mt-8 flex gap-4 flex-wrap">
                            <button
                                onClick={() => navigate('/shop')}
                                className="flex items-center gap-2 bg-[#4A332C] text-white px-8 py-4 rounded-full text-base font-semibold hover:bg-[#2C1A14] transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                            >
                                Order Now <ArrowRight className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => navigate('/custom-cake')}
                                className="flex items-center gap-2 border-2 border-[#4A332C] text-[#4A332C] px-8 py-4 rounded-full text-base font-semibold hover:bg-[#4A332C] hover:text-white transition-all"
                            >
                                Custom Cake
                            </button>
                        </div>
                        {/* Stats */}
                        <div className="mt-10 flex gap-8 text-center">
                            {[['500+', 'Happy Customers'], ['100%', 'Homemade'], ['2-Day', 'Delivery']].map(([n, l]) => (
                                <div key={l}>
                                    <div className="text-2xl font-bold text-[#4A332C]">{n}</div>
                                    <div className="text-xs text-[#C8B6A6] mt-0.5">{l}</div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Hero Image */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.2 }}
                        className="relative"
                    >
                        <div className="rounded-[3rem] overflow-hidden shadow-[0_30px_80px_rgba(74,51,44,0.2)] aspect-square max-w-lg mx-auto">
                            <img
                                src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=700&auto=format&fit=crop"
                                alt="Premium bakery cake on marble"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        {/* Floating badge */}
                        <motion.div
                            animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                            className="absolute -bottom-4 -left-4 bg-white rounded-2xl p-4 shadow-xl flex items-center gap-3"
                        >
                            <span className="text-3xl">🎂</span>
                            <div>
                                <p className="font-bold text-[#4A332C] text-sm">Fresh Daily</p>
                                <p className="text-[#C8B6A6] text-xs">Baked every morning</p>
                            </div>
                        </motion.div>
                        <motion.div
                            animate={{ y: [0, 8, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                            className="absolute -top-4 -right-4 bg-[#4A332C] text-white rounded-2xl p-4 shadow-xl"
                        >
                            <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map(s => <Star key={s} fill="white" className="w-3 h-3" />)}
                            </div>
                            <p className="text-xs font-medium mt-1">500+ Reviews</p>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* ── FEATURED CAKES ───────────────────────────── */}
            <section className="max-w-7xl mx-auto px-6 py-20">
                <div className="flex justify-between items-end mb-10">
                    <div>
                        <span className="text-sm font-semibold text-[#C8B6A6] uppercase tracking-wider">Our Bestsellers</span>
                        <h2 className="text-4xl font-bold text-[#4A332C] mt-1">Featured Cakes</h2>
                    </div>
                    <Link to="/shop" className="flex items-center gap-1 text-[#4A332C] font-semibold hover:gap-3 transition-all">
                        View All <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {featured.length > 0
                        ? featured.slice(0, 4).map(p => <ProductCard key={p._id} product={p} />)
                        : [1, 2, 3, 4].map(i => (
                            <div key={i} className="bg-white rounded-3xl h-72 animate-pulse">
                                <div className="h-52 bg-[#F1DEC9]/40 rounded-t-3xl" />
                                <div className="p-4 space-y-2">
                                    <div className="h-3 bg-[#F1DEC9] rounded w-1/2" />
                                    <div className="h-4 bg-[#F1DEC9] rounded w-3/4" />
                                </div>
                            </div>
                        ))
                    }
                </div>
            </section>

            {/* ── CUSTOM CAKE CTA ──────────────────────────── */}
            <section className="mx-6 lg:mx-auto max-w-7xl px-0">
                <div className="relative bg-[#4A332C] rounded-[3rem] overflow-hidden p-12 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="absolute inset-0 opacity-10">
                        <img src="https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?w=1200" className="w-full h-full object-cover" alt="" />
                    </div>
                    <div className="relative z-10">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Design Your Dream Cake</h2>
                        <p className="text-[#C8B6A6] text-lg max-w-lg">Choose every detail — flavor, size, frosting, toppings. We'll bake it exactly as you imagined.</p>
                    </div>
                    <div className="relative z-10 shrink-0">
                        <Link to="/custom-cake" className="inline-flex items-center gap-2 bg-white text-[#4A332C] px-8 py-4 rounded-full text-lg font-bold hover:bg-[#F1DEC9] transition-colors shadow-lg">
                            Build My Cake <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── INSTAGRAM GRID ───────────────────────────── */}
            <section className="max-w-7xl mx-auto px-6 py-20">
                <div className="text-center mb-10">
                    <h2 className="text-4xl font-bold text-[#4A332C]">Follow Our Sweet Journey</h2>
                    <a href="https://instagram.com" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-[#C8B6A6] mt-2 hover:text-[#4A332C] transition-colors">
                        <Instagram className="w-4 h-4" /> @lovebakes_in
                    </a>
                </div>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                    {INSTAGRAM_POSTS.map((url, i) => (
                        <motion.a key={i} href="https://instagram.com" target="_blank" rel="noreferrer"
                            whileHover={{ scale: 1.04 }}
                            className="aspect-square rounded-2xl overflow-hidden block"
                        >
                            <img src={url} alt="Instagram post" className="w-full h-full object-cover" loading="lazy" />
                        </motion.a>
                    ))}
                </div>
            </section>

            {/* ── TESTIMONIALS ─────────────────────────────── */}
            <section className="bg-[#FFF8F5] py-20 px-6">
                <div className="max-w-5xl mx-auto text-center mb-12">
                    <h2 className="text-4xl font-bold text-[#4A332C]">What Our Customers Say</h2>
                </div>
                <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                    {TESTIMONIALS.map((t, i) => (
                        <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                            className="bg-white rounded-3xl p-8 shadow-[0_4px_24px_rgba(74,51,44,0.06)]"
                        >
                            <div className="flex gap-1 mb-4">
                                {[...Array(t.rating)].map((_, s) => <Star key={s} fill="#4A332C" className="w-4 h-4 text-[#4A332C]" />)}
                            </div>
                            <p className="text-[#4A332C]/80 text-sm leading-relaxed mb-5">"{t.review}"</p>
                            <div className="font-semibold text-[#4A332C]">{t.name}</div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ── ABOUT SNIPPET ────────────────────────────── */}
            <section className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="rounded-[3rem] overflow-hidden h-96">
                    <img
                        src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=700&auto=format&fit=crop"
                        alt="Baker decorating cake in cozy kitchen"
                        className="w-full h-full object-cover"
                    />
                </div>
                <div>
                    <span className="text-sm font-semibold text-[#C8B6A6] uppercase tracking-wider">Our Story</span>
                    <h2 className="text-4xl font-bold text-[#4A332C] mt-2 mb-6">Started with One Imperfect Cake</h2>
                    <p className="text-[#4A332C]/70 leading-relaxed mb-4">
                        LoveBakes started when a boy tried to bake a cake for the girl he loved. He did not know cooking. He only knew love.
                    </p>
                    <p className="text-[#4A332C]/70 leading-relaxed mb-6">
                        From messy, flour-covered kitchen experiments came the first cake. That small moment became LoveBakes — a bakery baked from the heart.
                    </p>
                    <Link to="/about" className="inline-flex items-center gap-2 text-[#4A332C] font-semibold border-b-2 border-[#4A332C] pb-0.5 hover:gap-4 transition-all">
                        Read Our Story <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </section>

            {/* ── LOCATION & CONTACT ───────────────────────── */}
            <section className="bg-[#4A332C] py-16 px-6 text-white">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    {[
                        { icon: <MapPin className="w-8 h-8 mx-auto mb-3 text-[#F1DEC9]" />, title: 'Find Us', text: 'Bhubaneswar, Odisha, India 751001' },
                        { icon: <Phone className="w-8 h-8 mx-auto mb-3 text-[#F1DEC9]" />, title: 'Call / WhatsApp', text: '+91 99999 99999' },
                        { icon: <MessageCircle className="w-8 h-8 mx-auto mb-3 text-[#F1DEC9]" />, title: 'Chat with Us', text: 'Open Mon–Sun, 9am–9pm' },
                    ].map((c, i) => (
                        <div key={i} className="bg-white/10 backdrop-blur rounded-3xl p-8">
                            {c.icon}
                            <h3 className="font-bold text-lg mb-1">{c.title}</h3>
                            <p className="text-[#C8B6A6] text-sm">{c.text}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Home;
