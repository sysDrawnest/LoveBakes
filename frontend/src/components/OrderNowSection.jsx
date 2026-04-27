import { motion } from 'framer-motion';
import { ArrowRight, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const OrderNowSection = () => {
    const navigate = useNavigate();

    return (
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
                            className="flex items-center gap-2 bg-[#4A332C] text-white px-8 py-4 rounded-full text-base font-semibold hover:bg-[#2C1A14] transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 cursor-pointer"
                        >
                            Order Now <ArrowRight className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => navigate('/custom-cake')}
                            className="flex items-center gap-2 border-2 border-[#4A332C] text-[#4A332C] px-8 py-4 rounded-full text-base font-semibold hover:bg-[#4A332C] hover:text-white transition-all cursor-pointer"
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
                            {[1, 2, 3, 4, 5].map(s => <Star key={s} fill="white" className="w-3 h-3 text-white" />)}
                        </div>
                        <p className="text-xs font-medium mt-1">500+ Reviews</p>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default OrderNowSection;
