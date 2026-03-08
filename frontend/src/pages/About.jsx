import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const About = () => (
    <div className="max-w-7xl mx-auto px-4">
        {/* Hero */}
        <section className="py-20 grid grid-cols-1 md:grid-cols-2 gap-14 items-center">
            <motion.div className="rounded-[3rem] overflow-hidden shadow-[0_20px_60px_rgba(74,51,44,0.15)] h-[500px]"
                initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
                <img
                    src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=700&auto=format&fit=crop"
                    alt="Baker in cozy kitchen"
                    className="w-full h-full object-cover"
                />
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}>
                <span className="text-sm font-semibold text-[#C8B6A6] uppercase tracking-widest">Our Story</span>
                <h1 className="text-5xl font-bold text-[#4A332C] leading-tight mt-3 mb-6">
                    Started with<br />One Imperfect<br />Cake.
                </h1>
                <div className="space-y-4 text-[#4A332C]/75 text-lg leading-relaxed">
                    <p>LoveBakes started when a boy tried to bake a cake for the girl he loved.</p>
                    <p>He did not know cooking. He only knew love.</p>
                    <p>From messy, flour-covered kitchen experiments — collapsed layers, uneven frosting, and burnt edges — came the first cake. Imperfect. But made with every ounce of feeling he had.</p>
                    <p>She ate every crumb. And said it was the best cake she'd ever tasted.</p>
                    <p className="font-semibold text-[#4A332C]">That small moment became LoveBakes.</p>
                </div>
                <Link to="/shop" className="inline-flex items-center gap-2 mt-8 bg-[#4A332C] text-white px-7 py-3.5 rounded-full font-semibold hover:bg-[#2C1A14] transition-colors">
                    Shop Now <ArrowRight className="w-4 h-4" />
                </Link>
            </motion.div>
        </section>

        {/* Values */}
        <section className="pb-20">
            <h2 className="text-4xl font-bold text-[#4A332C] text-center mb-12">What We Stand For</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { icon: '❤️', title: 'Baked with Love', desc: 'Every cake is made by hand, with care and intention — never factory produced.' },
                    { icon: '🌿', title: 'Fresh Ingredients', desc: 'We use only fresh, quality ingredients. No artificial preservatives, no shortcuts.' },
                    { icon: '🎨', title: 'Custom Crafted', desc: 'Your vision, our expertise. We create cakes that tell your story.' },
                ].map((v, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                        className="bg-white rounded-3xl p-8 text-center shadow-[0_8px_40px_rgba(74,51,44,0.06)]">
                        <span className="text-4xl mb-4 block">{v.icon}</span>
                        <h3 className="text-xl font-bold text-[#4A332C] mb-2">{v.title}</h3>
                        <p className="text-[#4A332C]/70 text-sm leading-relaxed">{v.desc}</p>
                    </motion.div>
                ))}
            </div>
        </section>

        {/* Odisha Culture Band */}
        <section className="bg-[#4A332C] rounded-[3rem] p-12 mb-20 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
                <h2 className="text-white text-4xl font-bold mb-4">Rooted in Odisha</h2>
                <p className="text-[#C8B6A6] text-lg leading-relaxed">
                    Born in the warmth of Bhubaneswar, our recipes carry the soul of Odia hospitality. From terracotta-colored kitchens to vibrant Sambalpuri celebrations — every LoveBakes creation carries home.
                </p>
            </div>
            <div className="rounded-2xl overflow-hidden h-64">
                <img src="https://images.unsplash.com/photo-1602081964546-b9a78d55e78c?w=600&auto=format&fit=crop" alt="Warm bakery" className="w-full h-full object-cover" />
            </div>
        </section>
    </div>
);

export default About;
