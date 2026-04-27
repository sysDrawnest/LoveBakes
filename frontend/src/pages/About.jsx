import React from 'react';
import CraftsmanshipGrid from '../components/CraftsmanshipGrid';

const About = () => {
 return (
 <>
 {/* Hero/About Section */}
 <section className="px-6 md:px-20 py-12 md:py-24 max-w-7xl mx-auto">
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
 {/* Left Side: Cinematic Image */}
 <div className="relative group">
 {/* Organic Shape Background Decor */}
 <div className="absolute -top-10 -left-10 w-64 h-64 bg-brand-blush/20 organic-shape -z-10 flour-texture"></div>
 <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-brand-beige/30 organic-shape -z-10"></div>
 
 <div className="relative rounded-xl overflow-hidden shadow-2xl transition-transform duration-500 group-hover:scale-[1.01]">
 <div 
 className="aspect-[4/5] bg-cover bg-center"
 style={{ backgroundImage: `url('/src/assets/about.png')` }}
 role="img"
 aria-label="Young baker decorating cake with flour, brass utensils, and marigolds in warm sunlight"
 ></div>

 {/* Overlay for luxury feel */}
 <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/60 to-transparent pointer-events-none"></div>
 </div>

 {/* Floating Element: Sambalpuri Fabric / Texture Note */}
 <div className="absolute bottom-6 -left-4 bg-brand-cream p-4 rounded-lg shadow-lg max-w-[180px] hidden md:block">
 <p className="text-xs italic text-brand-chocolate/70 ">
 Crafted with heritage and Sambalpuri soul
 </p>
 <div className="mt-2 h-1 w-full bg-gradient-to-r from-brand-blush to-transparent"></div>
 </div>
 </div>

 {/* Right Side: Content */}
 <div className="flex flex-col gap-8">
 <div className="space-y-4">
 <span className="text-brand-chocolate/60 font-semibold tracking-widest text-xs uppercase">
 Our Humble Beginnings
 </span>
 <h1 className="text-4xl md:text-6xl font-bold text-brand-chocolate serif-elegant leading-tight">
 Baked With <span className="text-brand-blush italic">Love</span>
 </h1>
 <div className="w-20 h-1 bg-brand-blush/30 rounded-full"></div>
 </div>

 <div className="space-y-6">
 <p className="text-lg md:text-xl text-brand-chocolate/80 leading-relaxed font-light">
 LoveBakes started with a simple moment. A boy trying to bake a cake for the girl he loved. 
 He didn't know recipes. He didn't know baking. But he knew love.
 </p>
 <p className="text-base text-brand-chocolate/60 leading-relaxed">
 From messy flour-covered experiments came the first cake. That moment slowly turned into LoveBakes — 
 a place where every dessert carries the same feeling. We believe that the secret ingredient isn't 
 found in a pantry, but in the heart of the baker.
 </p>
 </div>

 <div className="flex flex-col sm:flex-row gap-4 pt-4">
 <button className="px-8 py-4 bg-brand-blush text-brand-dark rounded-lg font-bold shadow-lg shadow-brand-blush/30 hover:bg-brand-blush/80 transition-all flex items-center justify-center gap-2">
 <span>Learn More</span>
 <span className="material-symbols-outlined text-sm">arrow_forward</span>
 </button>
 <button className="px-8 py-4 bg-brand-beige/30 text-brand-chocolate border border-brand-blush/20 rounded-lg font-bold hover:bg-brand-beige/50 transition-all">
 Our Menu
 </button>
 </div>

 {/* Decorative Flour Dust Icon */}
 <div className="flex items-center gap-3 pt-8 opacity-40">
 <span className="material-symbols-outlined text-brand-blush animate-float">skillet</span>
 <span className="material-symbols-outlined text-brand-blush animate-float" style={{ animationDelay: '0.5s' }}>bakery_dining</span>
 <span className="material-symbols-outlined text-brand-blush animate-float" style={{ animationDelay: '1s' }}>egg_alt</span>
 </div>
 </div>
 </div>
 </section>

 {/* Value Proposition Grid */}
 <CraftsmanshipGrid />
 </>
 );
};

export default About;