import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAnalyticsApi, getAllOrdersApi, updateOrderStatusApi, getProductsApi, deleteProductApi, getAllCustomOrdersApi } from '../api/api';
import { motion } from 'framer-motion';
import { Package, Users, TrendingUp, ShoppingBag, Trash2, Edit3 } from 'lucide-react';

const ORDER_STATUSES = ['pending', 'accepted', 'preparing', 'out for delivery', 'delivered', 'cancelled'];
const TABS = ['Analytics', 'Orders', 'Products', 'Custom Orders'];

const AdminDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [tab, setTab] = useState('Analytics');
    const [analytics, setAnalytics] = useState(null);
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [customOrders, setCustomOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user || user.role !== 'admin') { navigate('/'); return; }
        Promise.all([
            getAnalyticsApi().then(r => setAnalytics(r.data)),
            getAllOrdersApi().then(r => setOrders(r.data.orders || [])),
            getProductsApi({ limit: 50 }).then(r => setProducts(r.data.products || [])),
            getAllCustomOrdersApi().then(r => setCustomOrders(r.data || [])),
        ]).catch(() => { }).finally(() => setLoading(false));
    }, [user]);

    const handleStatusChange = async (orderId, status) => {
        try {
            await updateOrderStatusApi(orderId, { orderStatus: status });
            setOrders(prev => prev.map(o => o._id === orderId ? { ...o, orderStatus: status } : o));
        } catch (e) { alert('Failed to update status'); }
    };

    const handleDeleteProduct = async (id) => {
        if (!window.confirm('Delete this product?')) return;
        try {
            await deleteProductApi(id);
            setProducts(prev => prev.filter(p => p._id !== id));
        } catch (e) { alert('Failed to delete'); }
    };

    if (!user || user.role !== 'admin') return null;

    return (
        <div className="max-w-7xl mx-auto px-4 py-10">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-[#4A332C]">Admin Dashboard 🍞</h1>
                <span className="text-sm text-[#C8B6A6]">Logged in as {user.name}</span>
            </div>

            {/* Tabs */}
            <div className="flex gap-3 overflow-x-auto pb-2 mb-8">
                {TABS.map(t => (
                    <button key={t} onClick={() => setTab(t)}
                        className={`px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${tab === t ? 'bg-[#4A332C] text-white' : 'bg-white border border-[#F1DEC9] text-[#4A332C]'}`}>
                        {t}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-pulse">
                    {[1, 2, 3, 4].map(i => <div key={i} className="bg-white rounded-2xl h-28" />)}
                </div>
            ) : (
                <>
                    {/* Analytics */}
                    {tab === 'Analytics' && analytics && (
                        <div>
                            {/* Stat Cards */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-10">
                                {[
                                    { icon: <ShoppingBag className="w-6 h-6" />, label: 'Total Orders', value: analytics.totalOrders },
                                    { icon: <ShoppingBag className="w-6 h-6" />, label: "Today's Orders", value: analytics.todayOrders },
                                    { icon: <Users className="w-6 h-6" />, label: 'Total Users', value: analytics.totalUsers },
                                    { icon: <TrendingUp className="w-6 h-6" />, label: 'Total Revenue', value: `₹${analytics.totalRevenue?.toFixed(0)}` },
                                ].map((s, i) => (
                                    <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                                        className="bg-white rounded-2xl p-5 shadow-[0_4px_24px_rgba(74,51,44,0.07)]">
                                        <div className="w-10 h-10 rounded-xl bg-[#4A332C]/10 flex items-center justify-center text-[#4A332C] mb-3">{s.icon}</div>
                                        <p className="text-sm text-[#C8B6A6]">{s.label}</p>
                                        <p className="text-2xl font-bold text-[#4A332C]">{s.value}</p>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Daily Sales Table */}
                            <div className="bg-white rounded-2xl p-5 shadow-[0_4px_20px_rgba(74,51,44,0.06)] mb-10">
                                <h3 className="font-bold text-[#4A332C] mb-4">Daily Sales (Last 7 Days)</h3>
                                {analytics.dailySales?.length > 0 ? (
                                    <div className="overflow-x-auto"><table className="w-full text-sm text-[#4A332C]">
                                        <thead><tr className="text-left text-[#C8B6A6]">
                                            <th className="pb-3 pr-4">Date</th>
                                            <th className="pb-3 pr-4">Orders</th>
                                            <th className="pb-3">Revenue</th>
                                        </tr></thead>
                                        <tbody>
                                            {analytics.dailySales.map(d => (
                                                <tr key={d._id} className="border-t border-[#F1DEC9]/50">
                                                    <td className="py-2 pr-4">{d._id}</td>
                                                    <td className="py-2 pr-4">{d.count}</td>
                                                    <td className="py-2">₹{d.revenue}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table></div>
                                ) : <p className="text-[#C8B6A6] text-sm">No sales data yet.</p>}
                            </div>

                            {/* Popular Products */}
                            <div className="bg-white rounded-2xl p-5 shadow-[0_4px_20px_rgba(74,51,44,0.06)]">
                                <h3 className="font-bold text-[#4A332C] mb-4">Popular Products</h3>
                                {analytics.popularProducts?.length > 0 ? (
                                    <div className="space-y-3">
                                        {analytics.popularProducts.map((p, i) => (
                                            <div key={i} className="flex justify-between items-center text-sm">
                                                <span className="text-[#4A332C]">{p.name || `Product #${i + 1}`}</span>
                                                <span className="font-bold text-[#4A332C]">{p.count} sold</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : <p className="text-[#C8B6A6] text-sm">No orders yet.</p>}
                            </div>
                        </div>
                    )}

                    {/* Orders */}
                    {tab === 'Orders' && (
                        <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(74,51,44,0.06)] overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-[#FFF8F5]">
                                        <tr className="text-left text-[#C8B6A6]">
                                            <th className="py-4 px-5">Order ID</th>
                                            <th className="py-4 px-5">Customer</th>
                                            <th className="py-4 px-5">Total</th>
                                            <th className="py-4 px-5">Date</th>
                                            <th className="py-4 px-5">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.map(o => (
                                            <tr key={o._id} className="border-t border-[#F1DEC9]/50">
                                                <td className="py-3 px-5 font-mono text-xs text-[#C8B6A6]">#{o._id.slice(-8).toUpperCase()}</td>
                                                <td className="py-3 px-5 text-[#4A332C]">{o.user?.name || 'Guest'}</td>
                                                <td className="py-3 px-5 font-bold text-[#4A332C]">₹{o.totalPrice}</td>
                                                <td className="py-3 px-5 text-[#C8B6A6]">{new Date(o.createdAt).toLocaleDateString('en-IN')}</td>
                                                <td className="py-3 px-5">
                                                    <select
                                                        value={o.orderStatus}
                                                        onChange={e => handleStatusChange(o._id, e.target.value)}
                                                        className="border border-[#F1DEC9] rounded-lg px-2 py-1 text-xs text-[#4A332C] focus:outline-none focus:ring-1 focus:ring-[#4A332C]/30"
                                                    >
                                                        {ORDER_STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                                                    </select>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {orders.length === 0 && <p className="text-center py-10 text-[#C8B6A6]">No orders yet</p>}
                            </div>
                        </div>
                    )}

                    {/* Products */}
                    {tab === 'Products' && (
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold text-[#4A332C]">Products ({products.length})</h2>
                                <span className="text-sm text-[#C8B6A6]">Use seed.js to add products</span>
                            </div>
                            <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(74,51,44,0.06)] overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-[#FFF8F5]">
                                        <tr className="text-left text-[#C8B6A6]">
                                            <th className="py-4 px-5">Image</th>
                                            <th className="py-4 px-5">Name</th>
                                            <th className="py-4 px-5">Category</th>
                                            <th className="py-4 px-5">Price</th>
                                            <th className="py-4 px-5">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {products.map(p => (
                                            <tr key={p._id} className="border-t border-[#F1DEC9]/50">
                                                <td className="py-3 px-5">
                                                    <img src={p.images?.[0]} alt={p.name} className="w-10 h-10 rounded-lg object-cover" />
                                                </td>
                                                <td className="py-3 px-5 font-medium text-[#4A332C]">{p.name}</td>
                                                <td className="py-3 px-5 text-[#C8B6A6]">{p.category}</td>
                                                <td className="py-3 px-5 text-[#4A332C]">₹{p.sizes?.[0]?.price}+</td>
                                                <td className="py-3 px-5">
                                                    <button onClick={() => handleDeleteProduct(p._id)} className="text-red-400 hover:text-red-600 p-1.5 hover:bg-red-50 rounded-lg transition-colors">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Custom Orders */}
                    {tab === 'Custom Orders' && (
                        <div className="space-y-4">
                            {customOrders.length === 0 && <p className="text-center py-12 text-[#C8B6A6]">No custom orders yet</p>}
                            {customOrders.map(o => (
                                <div key={o._id} className="bg-white rounded-2xl p-5 shadow-[0_4px_20px_rgba(74,51,44,0.06)]">
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <p className="font-bold text-[#4A332C]">{o.user?.name}</p>
                                            <p className="text-sm text-[#C8B6A6]">{o.user?.email} • {o.user?.phone}</p>
                                        </div>
                                        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${o.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                o.status === 'quoted' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                                            }`}>{o.status}</span>
                                    </div>
                                    <div className="text-sm text-[#4A332C]/80 grid grid-cols-2 md:grid-cols-4 gap-3">
                                        <div><span className="text-[#C8B6A6]">Flavor</span><p>{o.flavor}</p></div>
                                        <div><span className="text-[#C8B6A6]">Size</span><p>{o.size}</p></div>
                                        <div><span className="text-[#C8B6A6]">Shape</span><p>{o.shape}</p></div>
                                        <div><span className="text-[#C8B6A6]">Delivery</span><p>{new Date(o.deliveryDate).toLocaleDateString('en-IN')}</p></div>
                                    </div>
                                    {o.message && <p className="text-sm text-[#4A332C]/70 mt-2 italic">"{o.message}"</p>}
                                    {o.specialInstructions && <p className="text-sm text-[#4A332C]/70 mt-1">Note: {o.specialInstructions}</p>}
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default AdminDashboard;
