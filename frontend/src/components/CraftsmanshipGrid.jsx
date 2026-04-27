import React from 'react';

const CraftsmanshipGrid = () => {
 const craftsmanshipItems = [
 {
 icon: 'egg',
 title: 'Premium Ingredients',
 description: 'Sourced globally for the finest taste, from Belgian cocoa to local organic berries.'
 },
 {
 icon: 'pan_tool_alt',
 title: 'Handcrafted',
 description: 'Every detail matters in our kitchen. No machines can replicate the human touch.'
 },
 {
 icon: 'cloud',
 title: 'Baked Fresh',
 description: 'Straight from the oven to your heart. We bake in small batches throughout the day.'
 }
 ];

 return (
 <section className="bg-brand-beige/20 py-20 px-6 md:px-20">
 <div className="max-w-7xl mx-auto">
 <div className="text-center mb-16">
 <h2 className="text-3xl font-bold text-brand-chocolate serif-elegant">
 Our Craftsmanship
 </h2>
 <p className="text-brand-chocolate/70 mt-2">
 Every detail is a testament to our passion
 </p>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
 {craftsmanshipItems.map((item, index) => (
 <div 
 key={index}
 className="flex flex-col gap-4 rounded-xl border border-brand-blush/20 bg-brand-cream p-8 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 duration-300"
 >
 <div className="bg-brand-blush/20 w-12 h-12 rounded-lg flex items-center justify-center">
 <span className="material-symbols-outlined text-2xl text-brand-blush">{item.icon}</span>
 </div>
 <div className="flex flex-col gap-2">
 <h3 className="text-brand-chocolate text-lg font-bold">
 {item.title}
 </h3>
 <p className="text-brand-chocolate/80 text-sm leading-relaxed">
 {item.description}
 </p>
 </div>
 </div>
 ))}
 </div>

 {/* Decorative blob element */}
 <div className="relative h-20 mt-12 overflow-hidden opacity-30">
 <div className="absolute left-1/4 top-0 w-32 h-32 bg-brand-blush/20 organic-shape animate-blob-slow"></div>
 <div className="absolute right-1/4 top-0 w-24 h-24 bg-brand-beige/30 organic-shape animate-blob"></div>
 </div>
 </div>
 </section>
 );
};

export default CraftsmanshipGrid;