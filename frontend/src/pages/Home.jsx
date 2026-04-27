import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Instagram, MapPin, MessageCircle, Phone } from 'lucide-react';
<<<<<<< HEAD
import heroImage from '../assets/hero image.png';
import OrderNowSection from '../components/OrderNowSection';
import WhyChooseUs from '../components/WhyChooseUs';
import WhatsAppOrder from '../components/WhatsAppOrder';
import ProductShowcase from '../components/ProductShowcase';
=======
import { useEffect, useState } from 'react';
import { getFeaturedProductsApi } from '../api/api';
import ProductCard from '../components/ProductCard';
import heroImage from '../assets/hero image.png';
import OrderNowSection from '../components/OrderNowSection';
>>>>>>> efde3d12d5492354106b7066d2592d0917893253

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
    const navigate = useNavigate();

<<<<<<< HEAD
=======
    useEffect(() => {
        getFeaturedProductsApi()
            .then(r => {
                // The backend typically returns either an array directly or { success, products }
                const products = Array.isArray(r.data) ? r.data : (r.data?.products || r.data?.data || []);
                setFeatured(products);
            })
            .catch(() => {
                // Ignore silent errors for now, skeleton will stay or use empty state
                setFeatured([]);
            });
    }, []);

>>>>>>> efde3d12d5492354106b7066d2592d0917893253
    return (
        <div className="w-full">
            {/* ── NEW HERO ─────────────────────────────────────── */}
            {/* DESKTOP HERO (Hidden on mobile) */}
            <section className="hidden md:flex relative min-h-[85vh] items-center bg-[#FAF6F0] overflow-hidden">
                <div className="w-full pl-6 md:pl-12 lg:pl-24 max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between">
                    {/* Left Text Box */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="w-full md:w-[45%] z-10 py-16 pr-8 bg-gradient-to-r from-[#FAF6F0] via-[#FAF6F0] to-transparent md:bg-none"
                    >
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif text-[#1F2937] leading-[1.15] tracking-tight">
                            Love Bakes <br />
                            Delivered to <br />
                            Your Door
                        </h1>
                        <p className="mt-6 text-lg text-[#4B5563] leading-relaxed max-w-md font-sans">
                            Discover our collection of <br />
                            handcrafted cakes and pastries
                        </p>
                        <button
                            onClick={() => navigate('/shop')}
                            className="mt-10 bg-[#D49A9A] text-white px-8 py-3.5 rounded-full text-sm font-bold uppercase tracking-widest hover:bg-[#C58989] transition-all shadow-[0_4px_14px_rgba(212,154,154,0.4)] hover:shadow-[0_6px_20px_rgba(212,154,154,0.6)] hover:-translate-y-0.5"
                        >
                            Shop All Sweets
                        </button>
                    </motion.div>

                    {/* Right Image */}
                    <div className="w-full md:w-[65%] absolute right-0 top-0 h-full hidden md:block z-0">
                        {/* A gradient mask to blend the left border of the image smoothly into the background */}
                        <div className="absolute inset-x-0 left-0 w-32 h-full bg-gradient-to-r from-[#FAF6F0] to-transparent z-10" />
                        <motion.img
                            initial={{ opacity: 0, scale: 1.05 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1.2 }}
                            src={heroImage}
                            alt="Beautiful bakery cakes and pastries on marble"
                            className="w-full h-full object-cover object-left"
                        />
                    </div>
                </div>
            </section>

            {/* MOBILE HERO (Hidden on desktop) */}
            <section className="md:hidden flex flex-col w-full bg-[#FAF6F0] mb-8">
                {/* Hero Image Component */}
                <div className="relative w-full h-[45vh] overflow-hidden">
                    <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url("${heroImage}")` }}></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#FAF6F0] to-transparent opacity-60"></div>
<<<<<<< HEAD
                </div>
                {/* Hero Text Content */}
                <div className="flex-1 px-6 py-8 flex flex-col justify-center items-center text-center -mt-12 relative z-10 bg-[#FAF6F0] rounded-t-2xl">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#E85D75]/10 text-[#E85D75] text-[11px] font-bold tracking-widest uppercase mb-5">
                        <span className="material-symbols-outlined text-sm">stars</span>
                        Premium Quality
                    </div>
                    <h1 className="text-[#3B2A25] text-4xl font-black leading-tight tracking-tight mb-4 font-serif">
                        Love Bakes Delivered to Your Door
                    </h1>
                    <p className="text-[#4B5563] text-sm font-normal leading-relaxed mb-8 max-w-[300px]">
                        Discover our curated collection of handcrafted cakes and pastries, baked daily with love.
                    </p>
                    <div className="flex flex-col w-full px-2 gap-3.5">
                        <button onClick={() => navigate('/shop')} className="w-full py-4 bg-[#E85D75] text-white rounded-full font-bold text-[13px] tracking-widest uppercase shadow-lg shadow-[#E85D75]/30 flex items-center justify-center gap-2">
                            SHOP ALL SWEETS
                            <ArrowRight className="w-4 h-4" />
                        </button>
                        <button onClick={() => navigate('/about')} className="w-full py-4 bg-[#E85D75]/10 text-[#E85D75] rounded-full font-bold text-[13px] tracking-widest uppercase border border-[#E85D75]/20">
                            OUR STORY
                        </button>
                    </div>
                </div>
            </section>


            {/* ── PRODUCT SHOWCASE (Bestsellers + Categories + CTA) ── */}
            <ProductShowcase />

            {/* ── ORDER NOW SECTION ────────────────────────── */}
            <OrderNowSection />
=======
                </div>
                {/* Hero Text Content */}
                <div className="flex-1 px-6 py-8 flex flex-col justify-center items-center text-center -mt-12 relative z-10 bg-[#FAF6F0] rounded-t-2xl">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#E85D75]/10 text-[#E85D75] text-[11px] font-bold tracking-widest uppercase mb-5">
                        <span className="material-symbols-outlined text-sm">stars</span>
                        Premium Quality
                    </div>
                    <h1 className="text-[#3B2A25] text-4xl font-black leading-tight tracking-tight mb-4 font-serif">
                        Love Bakes Delivered to Your Door
                    </h1>
                    <p className="text-[#4B5563] text-sm font-normal leading-relaxed mb-8 max-w-[300px]">
                        Discover our curated collection of handcrafted cakes and pastries, baked daily with love.
                    </p>
                    <div className="flex flex-col w-full px-2 gap-3.5">
                        <button onClick={() => navigate('/shop')} className="w-full py-4 bg-[#E85D75] text-white rounded-full font-bold text-[13px] tracking-widest uppercase shadow-lg shadow-[#E85D75]/30 flex items-center justify-center gap-2">
                            SHOP ALL SWEETS
                            <ArrowRight className="w-4 h-4" />
                        </button>
                        <button onClick={() => navigate('/about')} className="w-full py-4 bg-[#E85D75]/10 text-[#E85D75] rounded-full font-bold text-[13px] tracking-widest uppercase border border-[#E85D75]/20">
                            OUR STORY
                        </button>
                    </div>
                </div>
            </section>



            {/* ── FEATURED CAKES ───────────────────────────── */}
            <section className="max-w-7xl mx-auto px-6 py-20">
                <div className="flex justify-between items-end mb-10">
                    <div>
                        <span className="text-sm font-semibold text-[#C9A27E] uppercase tracking-wider">Our Bestsellers</span>
                        <h2 className="text-4xl font-bold text-[#3B2A25] mt-1">Featured Cakes</h2>
                    </div>
                    <Link to="/shop" className="flex items-center gap-1 text-[#3B2A25] font-semibold hover:gap-3 transition-all">
                        View All <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {featured && featured.length > 0
                        ? featured.slice(0, 4).map(p => <ProductCard key={p._id} product={p} />)
                        : [1, 2, 3, 4].map(i => (
                            <ProductCard key={`placeholder-${i}`} product={{
                                _id: `placeholder-${i}`,
                                name: "Artisan Chocolate Cake",
                                category: "Signature Collection",
                                description: "Decadent dark chocolate layers with a smooth ganache finish.",
                                images: ["https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400"],
                                sizes: [{ size: "1kg", price: 1200 }]
                            }} />
                        ))
                    }
                </div>
            </section>

            {/* ── ORDER NOW SECTION ────────────────────────── */}
            <OrderNowSection />

            {/* ── CUSTOM CAKE CTA ──────────────────────────── */}
            <section className="mx-6 lg:mx-auto max-w-7xl px-0">
                <div className="relative bg-[#3B2A25] rounded-[3rem] overflow-hidden p-12 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="absolute inset-0 opacity-10">
                        <img src="https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?w=1200" className="w-full h-full object-cover" alt="" />
                    </div>
                    <div className="relative z-10">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Design Your Dream Cake</h2>
                        <p className="text-[#C9A27E] text-lg max-w-lg">Choose every detail — flavor, size, frosting, toppings. We'll bake it exactly as you imagined.</p>
                    </div>
                    <div className="relative z-10 shrink-0">
                        <Link to="/custom-cake" className="inline-flex items-center gap-2 bg-white text-[#E85D75] px-8 py-4 rounded-full text-lg font-bold hover:bg-[#C9A27E] transition-colors shadow-lg">
                            Build My Cake <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </section>
>>>>>>> efde3d12d5492354106b7066d2592d0917893253

            {/* ── INSTAGRAM GRID ───────────────────────────── */}
            <section className="max-w-7xl mx-auto px-6 py-20">
                <div className="text-center mb-10">
                    <h2 className="text-4xl font-bold text-[#3B2A25]">Follow Our Sweet Journey</h2>
                    <a href="https://instagram.com" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-[#C9A27E] mt-2 hover:text-[#3B2A25] transition-colors">
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
            <section className="bg-[#FFF6F2] py-20 px-6">
                <div className="max-w-5xl mx-auto text-center mb-12">
                    <h2 className="text-4xl font-bold text-[#3B2A25]">What Our Customers Say</h2>
                </div>
                <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                    {TESTIMONIALS.map((t, i) => (
                        <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                            className="bg-white rounded-3xl p-8 shadow-[0_4px_24px_rgba(74,51,44,0.06)]"
                        >
                            <div className="flex gap-1 mb-4">
                                {[...Array(t.rating)].map((_, s) => <Star key={s} fill="#3B2A25" className="w-4 h-4 text-[#3B2A25]" />)}
                            </div>
                            <p className="text-[#3B2A25]/80 text-sm leading-relaxed mb-5">"{t.review}"</p>
                            <div className="font-semibold text-[#3B2A25]">{t.name}</div>
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
                    <span className="text-sm font-semibold text-[#C9A27E] uppercase tracking-wider">Our Story</span>
                    <h2 className="text-4xl font-bold text-[#3B2A25] mt-2 mb-6">Started with One Imperfect Cake</h2>
                    <p className="text-[#3B2A25]/70 leading-relaxed mb-4">
                        LoveBakes started when a boy tried to bake a cake for the girl he loved. He did not know cooking. He only knew love.
                    </p>
                    <p className="text-[#3B2A25]/70 leading-relaxed mb-6">
                        From messy, flour-covered kitchen experiments came the first cake. That small moment became LoveBakes — a bakery baked from the heart.
                    </p>
                    <Link to="/about" className="inline-flex items-center gap-2 text-[#3B2A25] font-semibold border-b-2 border-[#3B2A25] pb-0.5 hover:gap-4 transition-all">
                        Read Our Story <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </section>

            {/* ── WHY CHOOSE US ────────────────────────────── */}
            <WhyChooseUs />

            {/* ── WHATSAPP ORDER SECTION ────────────────────── */}
            <WhatsAppOrder />

            {/* ── LOCATION & CONTACT ───────────────────────── */}
            <section className="bg-[#3B2A25] py-16 px-6 text-white">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    {[
                        { icon: <MapPin className="w-8 h-8 mx-auto mb-3 text-[#C9A27E]" />, title: 'Find Us', text: 'Bhubaneswar, Odisha, India 751001' },
                        { icon: <Phone className="w-8 h-8 mx-auto mb-3 text-[#C9A27E]" />, title: 'Call / WhatsApp', text: '+91 99999 99999' },
                        { icon: <MessageCircle className="w-8 h-8 mx-auto mb-3 text-[#C9A27E]" />, title: 'Chat with Us', text: 'Open Mon–Sun, 9am–9pm' },
                    ].map((c, i) => (
                        <div key={i} className="bg-white/10 backdrop-blur rounded-3xl p-8">
                            {c.icon}
                            <h3 className="font-bold text-lg mb-1">{c.title}</h3>
                            <p className="text-[#C9A27E] text-sm">{c.text}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Home;
