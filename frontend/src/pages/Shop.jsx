import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { getProductsApi } from '../api/api';
import ProductCard from '../components/ProductCard';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';

const CATEGORIES = ['All', 'Cakes', 'Custom Cakes', 'Pastries', 'Cookies', 'Cupcakes', 'Desserts'];

const Shop = () => {
 const [searchParams] = useSearchParams();
 const initCategory = searchParams.get('category') || 'All';
 const [products, setProducts] = useState([]);
 const [loading, setLoading] = useState(true);
 const [category, setCategory] = useState(initCategory);
 const [search, setSearch] = useState('');

 useEffect(() => {
 setLoading(true);
 getProductsApi({ category: category !== 'All' ? category : undefined, search: search || undefined })
 .then(r => setProducts(r.data.products))
 .catch(() => { })
 .finally(() => setLoading(false));
 }, [category, search]);

 return (
 <div className="max-w-7xl mx-auto px-4 py-10">
 {/* Header */}
 <div className="text-center mb-10">
 <h1 className="text-4xl font-bold text-[#3B2A25]">Our Sweet Menu 🎂</h1>
 <p className="text-[#C9A27E] mt-2">All items freshly baked to order</p>
 </div>

 {/* Search */}
 <div className="relative max-w-md mx-auto mb-8">
 <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C9A27E]" />
 <input
 value={search}
 onChange={e => setSearch(e.target.value)}
 placeholder="Search cakes, pastries..."
 className="w-full pl-11 pr-5 py-3.5 bg-white border border-[#C9A27E] rounded-full text-sm text-[#3B2A25] focus:outline-none focus:ring-2 focus:ring-[#3B2A25]/20"
 />
 </div>

 {/* Category Tabs */}
 <div className="flex gap-3 overflow-x-auto pb-2 mb-10 scrollbar-hide">
 {CATEGORIES.map(c => (
 <button
 key={c}
 onClick={() => setCategory(c)}
 className={`px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${category === c
 ? 'bg-[#E85D75] text-white shadow-lg'
 : 'bg-white border border-[#C9A27E] text-[#3B2A25] hover:border-[#3B2A25]/30'
 }`}
 >
 {c}
 </button>
 ))}
 </div>

 {/* Products Grid */}
 {loading ? (
 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
 {[...Array(8)].map((_, i) => (
 <div key={i} className="bg-white rounded-3xl h-72 animate-pulse">
 <div className="h-52 bg-[#C9A27E]/40 rounded-t-3xl" />
 <div className="p-4 space-y-2">
 <div className="h-3 bg-[#C9A27E] rounded w-1/2" />
 <div className="h-4 bg-[#C9A27E] rounded w-3/4" />
 </div>
 </div>
 ))}
 </div>
 ) : products.length === 0 ? (
 <div className="text-center py-20 text-[#C9A27E]">
 <p className="text-5xl mb-4">🍰</p>
 <p className="text-lg font-medium">No items found.</p>
 <p className="text-sm mt-1">Try searching something else!</p>
 </div>
 ) : (
 <motion.div
 layout
 className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
 >
 {products.map(p => <ProductCard key={p._id} product={p} />)}
 </motion.div>
 )}
 </div>
 );
};

export default Shop;
