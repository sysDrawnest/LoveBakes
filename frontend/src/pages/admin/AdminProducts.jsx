import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getProductsApi, deleteProductApi } from '../../api/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    Search,
    Edit3,
    Trash2,
    MoreVertical,
    Filter,
    Package,
    ExternalLink,
    CheckCircle2,
    XCircle
} from 'lucide-react';

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const navigate = useNavigate();

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const res = await getProductsApi({ limit: 100 });
            setProducts(res.data.products || []);
        } catch (error) {
            console.error('Failed to fetch products');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
            try {
                await deleteProductApi(id);
                setProducts(prev => prev.filter(p => p._id !== id));
            } catch (error) {
                alert('Failed to delete product');
            }
        }
    };

    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const categories = ['All', 'Cakes', 'Custom Cakes', 'Pastries', 'Cookies', 'Cupcakes', 'Desserts'];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Inventory</h1>
                    <p className="text-slate-500">Manage your product catalog and availability.</p>
                </div>
                <Link
                    to="/admin/products/add"
                    className="flex items-center justify-center gap-2 bg-[#C9A84C] hover:bg-[#B6963E] text-slate-900 font-bold py-2.5 px-6 rounded-xl transition-all shadow-lg shadow-gold/10"
                >
                    <Plus size={20} />
                    <span>Add New Product</span>
                </Link>
            </div>

            {/* Filters & Search */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-[#C9A84C]/50 text-slate-700"
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0">
                    {categories.slice(0, 4).map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap
                ${selectedCategory === cat
                                    ? 'bg-slate-900 text-white'
                                    : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                {loading ? (
                    <div className="p-12 flex flex-col items-center justify-center text-slate-400">
                        <div className="w-10 h-10 border-4 border-[#C9A84C]/20 border-t-[#C9A84C] rounded-full animate-spin mb-4" />
                        <p className="font-medium">Loading products...</p>
                    </div>
                ) : filteredProducts.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50/50 text-slate-500 text-xs uppercase tracking-wider font-semibold">
                                    <th className="px-6 py-4">Product</th>
                                    <th className="px-6 py-4">Category</th>
                                    <th className="px-6 py-4">Price Range</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filteredProducts.map((p) => (
                                    <tr key={p._id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                                                    {p.images?.[0] ? (
                                                        <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                            <Package size={20} />
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900 line-clamp-1">{p.name}</p>
                                                    <p className="text-xs text-slate-400">ID: ...{p._id?.slice(-6)}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                                                {p.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-bold text-slate-900">
                                            ₹{p.sizes?.[0]?.price?.toLocaleString()}+
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1.5">
                                                {p.isAvailable ? (
                                                    <>
                                                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                                        <span className="text-xs font-bold text-emerald-600">Available</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <div className="w-2 h-2 rounded-full bg-slate-300" />
                                                        <span className="text-xs font-bold text-slate-400">Hidden</span>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => navigate(`/admin/products/edit/${p._id}`)}
                                                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                                                >
                                                    <Edit3 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(p._id)}
                                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-20 text-center">
                        <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-300">
                            <Package size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-1">No products found</h3>
                        <p className="text-slate-500 mb-6">Try adjusting your search or category filters.</p>
                        <button
                            onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }}
                            className="text-[#C9A84C] font-bold hover:underline"
                        >
                            Clear all filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminProducts;
