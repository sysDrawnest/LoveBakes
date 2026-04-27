import React from 'react';

const CraftsmanshipGrid = () => {
    const craftsmanshipItems = [
        {
            icon: 'skillet',
            title: 'Premium Ingredients',
            description: 'Sourced globally for the finest taste, from Belgian cocoa to local organic berries. We believe the soul of the pastry lies in its origin.',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAKJtMoUakBKq8roQ-sMHnkPuMMeuFv_zcyPf8S5Q6L26VlerhTBWLYIt6jq9jkBFT-P4tf3qi47OQuwjcourrkcb5EWX0gm2wCVUsdGKgNH_2_iHUrvbOM3UgPYIVnLeQavV3ja751Dw0MA0dCubnE4NaYKAYjI25jJpomvY9janCaIwyzD7U-QFt2GzskYj3RVqZ0tt4L1BzDmw4sS72WfDi4cf10Y_Td-svsKAPmBF-D3jHBSMwsv_-OIokA5zbFiy-zZFEVoQ',
            layout: 'horizontal-left'
        },
        {
            icon: 'mop',
            title: 'Handcrafted',
            description: 'Every detail matters in our kitchen. No machines can replicate the delicate human touch that gives our cakes their unique character.',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBATFy8JMsUk7YSzt4z5O5IdD6Ji9ZNkgUGJ3rD-LOIb30lM-MGNLgDtRSEUKt0sXlCW-S4fvChi2ipkSH1l9WV0sSTkKX-yoygvfcLZ07kahOBsZ4MUhi5VtkUURF4pwxAJUexbieJUSf1XGUy9TCdCpfohpF_nfWCljuz4-vED55Dp5sImcjHz-ENtnZQkxLz8kBakxLgOvvhUyJ6E4hDPGmErg1hCSerCcpPkYxzZ8FwMnG33UbjrATt0KbntXBEwd6oWddxKw',
            layout: 'vertical'
        },
        {
            icon: 'oven_gen',
            title: 'Baked Fresh',
            description: 'Straight from the oven to your heart. We bake in small batches throughout the day to ensure every crumb delivers that perfect, warm, melt-in-your-mouth experience.',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDI8nnNEQ5xhKeQUCncGJw67LdvCbsfxV1B52DD9Ll4xmqdL8uUUPk0AS7TRVDYV36sQoe-fTM6WHDr6fP7YSvq0uvAvPX9nTMwIvuzXLn77BbErxgA1J9-FuPZFgUUuSSelxoKs1rL5Cj6FMOEFObnZF5hYjGBDy0cMquIVZMPfAXavDp9wd2gy5lYrso4w89YKsrGyoX8b-wqAOSICOoW9Jg9y7HVd7TOHe4cbCf_Eh2OSB43WUR25XV1ovFU1QogLZ1-nU7w2w',
            layout: 'horizontal-right'
        }
    ];

    return (
        <section className="bg-surface py-20 px-gutter relative overflow-hidden">
            {/* Subtle Organic Background Decor */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20 z-0">
                <div className="absolute top-20 -left-20 w-96 h-96 bg-secondary-container rounded-full blur-[100px]"></div>
                <div className="absolute bottom-40 -right-20 w-80 h-80 bg-tertiary-fixed rounded-full blur-[120px]"></div>
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header Section: Magazine Style */}
                <div className="text-center mb-xl">
                    <div className="inline-flex items-center gap-4 mb-base">
                        <div className="h-[1px] w-12 bg-[#C9A27E]/40"></div>
                        <span className="font-label-sm text-label-sm uppercase tracking-widest text-secondary">
                            The Art of Baking
                        </span>
                        <div className="h-[1px] w-12 bg-[#C9A27E]/40"></div>
                    </div>
                    <h1 className="font-display-xl text-display-xl text-on-surface mb-md font-bold">
                        Our Craftsmanship
                    </h1>
                    <p className="font-accent-quote text-accent-quote text-on-surface-variant max-w-2xl mx-auto italic">
                        "Every bite is a love letter, crafted with patience and the finest ingredients."
                    </p>
                </div>

                {/* Craftsmanship Grid: Asymmetric/Editorial Layout */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
                    {/* Feature Card 1: Premium Ingredients - Horizontal with image on left */}
                    <div className="md:col-span-7 group">
                        <div className="glass-card cinematic-shadow rounded-xl border border-[#C9A27E]/20 overflow-hidden transition-all duration-500 hover:-translate-y-2">
                            <div className="flex flex-col md:flex-row h-full">
                                <div className="w-full md:w-1/2 relative min-h-[300px]">
                                    <img
                                        className="absolute inset-0 w-full h-full object-cover"
                                        alt="Close-up of premium dark chocolate chunks and organic raspberries on a marble surface with dramatic sunlight"
                                        src={craftsmanshipItems[0].image}
                                    />
                                </div>
                                <div className="w-full md:w-1/2 p-lg flex flex-col justify-center">
                                    <span className="material-symbols-outlined text-[#E85D75] text-5xl mb-md transition-transform group-hover:scale-110 duration-300">
                                        {craftsmanshipItems[0].icon}
                                    </span>
                                    <h3 className="font-headline-md text-headline-md text-on-surface mb-sm font-semibold">
                                        {craftsmanshipItems[0].title}
                                    </h3>
                                    <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                                        {craftsmanshipItems[0].description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Feature Card 2: Handcrafted - Vertical/Tall layout */}
                    <div className="md:col-span-5 group">
                        <div className="glass-card cinematic-shadow rounded-xl border border-[#C9A27E]/20 p-lg h-full flex flex-col justify-between transition-all duration-500 hover:-translate-y-2">
                            <div>
                                <span className="material-symbols-outlined text-[#E85D75] text-5xl mb-md transition-transform group-hover:rotate-12 duration-300">
                                    {craftsmanshipItems[1].icon}
                                </span>
                                <h3 className="font-headline-md text-headline-md text-on-surface mb-sm font-semibold">
                                    {craftsmanshipItems[1].title}
                                </h3>
                                <p className="font-body-md text-body-md text-on-surface-variant mb-lg leading-relaxed">
                                    {craftsmanshipItems[1].description}
                                </p>
                            </div>
                            <div className="rounded-lg overflow-hidden h-64 mt-auto">
                                <img
                                    className="w-full h-full object-cover"
                                    alt="Artisanal baker hands gently dusting a tiered cake with powdered sugar, soft golden hour lighting, cinematic focus"
                                    src={craftsmanshipItems[1].image}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Feature Card 3: Baked Fresh - Horizontal with image on right */}
                    <div className="md:col-span-12 group mt-md">
                        <div className="glass-card cinematic-shadow rounded-xl border border-[#C9A27E]/20 overflow-hidden transition-all duration-500 hover:-translate-y-2">
                            <div className="flex flex-col md:flex-row-reverse">
                                <div className="w-full md:w-3/5 h-80 relative">
                                    <img
                                        className="absolute inset-0 w-full h-full object-cover"
                                        alt="Row of freshly baked golden croissants and muffins cooling on a wire rack in a sunlit patisserie kitchen"
                                        src={craftsmanshipItems[2].image}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-r from-surface/80 to-transparent md:block hidden"></div>
                                </div>
                                <div className="w-full md:w-2/5 p-lg flex flex-col justify-center bg-white/20">
                                    <span className="material-symbols-outlined text-[#E85D75] text-5xl mb-md transition-transform group-hover:scale-95 duration-300">
                                        {craftsmanshipItems[2].icon}
                                    </span>
                                    <h3 className="font-headline-md text-headline-md text-on-surface mb-sm font-semibold">
                                        {craftsmanshipItems[2].title}
                                    </h3>
                                    <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                                        {craftsmanshipItems[2].description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Call to Action Decor */}
                <div className="mt-xl text-center">
                    <button className="px-lg py-md bg-[#E85D75] text-white rounded-xl font-label-sm text-label-sm uppercase tracking-widest cinematic-shadow hover:bg-primary-container transition-all hover:scale-105 active:scale-95">
                        Discover Our Collections
                    </button>
                </div>
            </div>

            {/* Global styles for custom classes */}
            <style jsx>{`
        .glass-card {
          background: rgba(255, 255, 255, 0.6);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }
        .cinematic-shadow {
          box-shadow: 0 10px 40px -15px rgba(212, 112, 90, 0.15);
        }
      `}</style>
        </section>
    );
};

export default CraftsmanshipGrid;