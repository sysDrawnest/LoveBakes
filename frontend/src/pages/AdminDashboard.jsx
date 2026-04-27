import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAnalyticsApi, getAllOrdersApi, updateOrderStatusApi, getProductsApi, deleteProductApi, getAllCustomOrdersApi, createProductApi, updateProductApi } from '../api/api';
import { motion } from 'framer-motion';
import { Package, Users, TrendingUp, ShoppingBag, Trash2, Edit3, Plus, X } from 'lucide-react';

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

 const [isProductModalOpen, setIsProductModalOpen] = useState(false);
 const [currentProduct, setCurrentProduct] = useState(null);
 const [productFormData, setProductFormData] = useState({
 name: '', description: '', category: 'Cakes',
 images: '', flavors: '',
 sizes: [{ size: '500g', price: 0 }]
 });

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

 const handleOpenProductModal = (product = null) => {
 if (product) {
 setCurrentProduct(product);
 setProductFormData({
 name: product.name || '',
 description: product.description || '',
 category: product.category || 'Cakes',
 images: product.images?.join(', ') || '',
 flavors: product.flavors?.join(', ') || '',
 sizes: product.sizes?.length > 0 ? [...product.sizes] : [{ size: '500g', price: 0 }]
 });
 } else {
 setCurrentProduct(null);
 setProductFormData({
 name: '', description: '', category: 'Cakes',
 images: '', flavors: '', sizes: [{ size: '500g', price: 0 }]
 });
 }
 setIsProductModalOpen(true);
 };

 const handleProductSubmit = async (e) => {
 e.preventDefault();
 try {
 const formattedData = {
 ...productFormData,
 images: productFormData.images.split(',').map(s => s.trim()).filter(Boolean),
 flavors: productFormData.flavors.split(',').map(s => s.trim()).filter(Boolean),
 };

 if (currentProduct) {
 const res = await updateProductApi(currentProduct._id, formattedData);
 setProducts(prev => prev.map(p => p._id === currentProduct._id ? res.data : p));
 } else {
 const res = await createProductApi(formattedData);
 setProducts(prev => [res.data, ...prev]);
 }
 setIsProductModalOpen(false);
 } catch (error) {
 alert('Failed to save product');
 }
 };

 const handleSizeChange = (index, field, value) => {
 const newSizes = [...productFormData.sizes];
 newSizes[index][field] = value;
 setProductFormData({ ...productFormData, sizes: newSizes });
 };

 const addSizeField = () => {
 setProductFormData({ ...productFormData, sizes: [...productFormData.sizes, { size: '1kg', price: 0 }] });
 };

 const removeSizeField = (index) => {
 const newSizes = productFormData.sizes.filter((_, i) => i !== index);
 setProductFormData({ ...productFormData, sizes: newSizes });
 };

 if (!user || user.role !== 'admin') return null;

 return (
 <div className="max-w-7xl mx-auto px-4 py-10">
 <div className="flex justify-between items-center mb-8">
 <h1 className="text-3xl font-bold text-[#3B2A25]">Admin Dashboard 🍞</h1>
 <span className="text-sm text-[#C9A27E]">Logged in as {user.name}</span>
 </div>

 {/* Tabs */}
 <div className="flex gap-3 overflow-x-auto pb-2 mb-8">
 {TABS.map(t => (
 <button key={t} onClick={() => setTab(t)}
 className={`px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${tab === t ? 'bg-[#E85D75] text-white' : 'bg-white border border-[#C9A27E] text-[#3B2A25]'}`}>
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
 <div className="w-10 h-10 rounded-xl bg-[#3B2A25]/10 flex items-center justify-center text-[#3B2A25] mb-3">{s.icon}</div>
 <p className="text-sm text-[#C9A27E]">{s.label}</p>
 <p className="text-2xl font-bold text-[#3B2A25]">{s.value}</p>
 </motion.div>
 ))}
 </div>

 {/* Daily Sales Table */}
 <div className="bg-white rounded-2xl p-5 shadow-[0_4px_20px_rgba(74,51,44,0.06)] mb-10">
 <h3 className="font-bold text-[#3B2A25] mb-4">Daily Sales (Last 7 Days)</h3>
 {analytics.dailySales?.length > 0 ? (
 <div className="overflow-x-auto"><table className="w-full text-sm text-[#3B2A25]">
 <thead><tr className="text-left text-[#C9A27E]">
 <th className="pb-3 pr-4">Date</th>
 <th className="pb-3 pr-4">Orders</th>
 <th className="pb-3">Revenue</th>
 </tr></thead>
 <tbody>
 {analytics.dailySales.map(d => (
 <tr key={d._id} className="border-t border-[#C9A27E]/50">
 <td className="py-2 pr-4">{d._id}</td>
 <td className="py-2 pr-4">{d.count}</td>
 <td className="py-2">₹{d.revenue}</td>
 </tr>
 ))}
 </tbody>
 </table></div>
 ) : <p className="text-[#C9A27E] text-sm">No sales data yet.</p>}
 </div>

 {/* Popular Products */}
 <div className="bg-white rounded-2xl p-5 shadow-[0_4px_20px_rgba(74,51,44,0.06)]">
 <h3 className="font-bold text-[#3B2A25] mb-4">Popular Products</h3>
 {analytics.popularProducts?.length > 0 ? (
 <div className="space-y-3">
 {analytics.popularProducts.map((p, i) => (
 <div key={i} className="flex justify-between items-center text-sm">
 <span className="text-[#3B2A25]">{p.name || `Product #${i + 1}`}</span>
 <span className="font-bold text-[#3B2A25]">{p.count} sold</span>
 </div>
 ))}
 </div>
 ) : <p className="text-[#C9A27E] text-sm">No orders yet.</p>}
 </div>
 </div>
 )}

 {/* Orders */}
 {tab === 'Orders' && (
 <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(74,51,44,0.06)] overflow-hidden">
 <div className="overflow-x-auto">
 <table className="w-full text-sm">
 <thead className="bg-[#FFF6F2]">
 <tr className="text-left text-[#C9A27E]">
 <th className="py-4 px-5">Order ID</th>
 <th className="py-4 px-5">Customer</th>
 <th className="py-4 px-5">Total</th>
 <th className="py-4 px-5">Date</th>
 <th className="py-4 px-5">Status</th>
 </tr>
 </thead>
 <tbody>
 {orders.map(o => (
 <tr key={o._id} className="border-t border-[#C9A27E]/50">
 <td className="py-3 px-5 font-mono text-xs text-[#C9A27E]">#{o._id.slice(-8).toUpperCase()}</td>
 <td className="py-3 px-5 text-[#3B2A25]">{o.user?.name || 'Guest'}</td>
 <td className="py-3 px-5 font-bold text-[#3B2A25]">₹{o.totalPrice}</td>
 <td className="py-3 px-5 text-[#C9A27E]">{new Date(o.createdAt).toLocaleDateString('en-IN')}</td>
 <td className="py-3 px-5">
 <select
 value={o.orderStatus}
 onChange={e => handleStatusChange(o._id, e.target.value)}
 className="border border-[#C9A27E] rounded-lg px-2 py-1 text-xs text-[#3B2A25] focus:outline-none focus:ring-1 focus:ring-[#3B2A25]/30"
 >
 {ORDER_STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
 </select>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 {orders.length === 0 && <p className="text-center py-10 text-[#C9A27E]">No orders yet</p>}
 </div>
 </div>
 )}

 {/* Products */}
 {tab === 'Products' && (
 <div>
 <div className="flex justify-between items-center mb-4">
 <h2 className="text-xl font-bold text-[#3B2A25]">Products ({products.length})</h2>
 <button onClick={() => handleOpenProductModal()} className="flex items-center gap-2 bg-[#E85D75] text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-[#3A2722] transition-colors">
 <Plus className="w-4 h-4" /> Add Product
 </button>
 </div>
 <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(74,51,44,0.06)] overflow-x-auto">
 <table className="w-full text-sm">
 <thead className="bg-[#FFF6F2]">
 <tr className="text-left text-[#C9A27E]">
 <th className="py-4 px-5">Image</th>
 <th className="py-4 px-5">Name</th>
 <th className="py-4 px-5">Category</th>
 <th className="py-4 px-5">Price</th>
 <th className="py-4 px-5">Actions</th>
 </tr>
 </thead>
 <tbody>
 {products.map(p => (
 <tr key={p._id} className="border-t border-[#C9A27E]/50">
 <td className="py-3 px-5">
 <img src={p.images?.[0]} alt={p.name} className="w-10 h-10 rounded-lg object-cover" />
 </td>
 <td className="py-3 px-5 font-medium text-[#3B2A25]">{p.name}</td>
 <td className="py-3 px-5 text-[#C9A27E]">{p.category}</td>
 <td className="py-3 px-5 text-[#3B2A25]">₹{p.sizes?.[0]?.price}+</td>
 <td className="py-3 px-5">
 <button onClick={() => handleOpenProductModal(p)} className="text-blue-400 hover:text-blue-600 p-1.5 hover:bg-blue-50 rounded-lg transition-colors mr-2">
 <Edit3 className="w-4 h-4" />
 </button>
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
 {customOrders.length === 0 && <p className="text-center py-12 text-[#C9A27E]">No custom orders yet</p>}
 {customOrders.map(o => (
 <div key={o._id} className="bg-white rounded-2xl p-5 shadow-[0_4px_20px_rgba(74,51,44,0.06)]">
 <div className="flex justify-between items-start mb-3">
 <div>
 <p className="font-bold text-[#3B2A25]">{o.user?.name}</p>
 <p className="text-sm text-[#C9A27E]">{o.user?.email} • {o.user?.phone}</p>
 </div>
 <span className={`text-xs font-semibold px-3 py-1 rounded-full ${o.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
 o.status === 'quoted' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
 }`}>{o.status}</span>
 </div>
 <div className="text-sm text-[#3B2A25]/80 grid grid-cols-2 md:grid-cols-4 gap-3">
 <div><span className="text-[#C9A27E]">Flavor</span><p>{o.flavor}</p></div>
 <div><span className="text-[#C9A27E]">Size</span><p>{o.size}</p></div>
 <div><span className="text-[#C9A27E]">Shape</span><p>{o.shape}</p></div>
 <div><span className="text-[#C9A27E]">Delivery</span><p>{new Date(o.deliveryDate).toLocaleDateString('en-IN')}</p></div>
 </div>
 {o.message && <p className="text-sm text-[#3B2A25]/70 mt-2 italic">"{o.message}"</p>}
 {o.specialInstructions && <p className="text-sm text-[#3B2A25]/70 mt-1">Note: {o.specialInstructions}</p>}
 </div>
 ))}
 </div>
 )}
 </>
 )}

 {/* Product Modal */}
 {isProductModalOpen && (
 <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
 <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-3xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
 <div className="flex justify-between items-center mb-6">
 <h2 className="text-2xl font-bold text-[#3B2A25]">{currentProduct ? 'Edit Product' : 'Add New Product'}</h2>
 <button onClick={() => setIsProductModalOpen(false)} className="p-2 hover:bg-[#C9A27E]/30 rounded-full transition-colors"><X className="w-6 h-6 text-[#3B2A25]" /></button>
 </div>
 <form onSubmit={handleProductSubmit} className="space-y-5">
 <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
 <div>
 <label className="block text-sm font-bold text-[#3B2A25] mb-2">Name</label>
 <input type="text" required value={productFormData.name} onChange={e => setProductFormData({ ...productFormData, name: e.target.value })} className="w-full px-4 py-3 bg-[#FFF6F2] border border-[#C9A27E] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3B2A25]/30 text-[#3B2A25]" placeholder="Product Name" />
 </div>
 <div>
 <label className="block text-sm font-bold text-[#3B2A25] mb-2">Category</label>
 <select value={productFormData.category} onChange={e => setProductFormData({ ...productFormData, category: e.target.value })} className="w-full px-4 py-3 bg-[#FFF6F2] border border-[#C9A27E] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3B2A25]/30 text-[#3B2A25]">
 {['Cakes', 'Custom Cakes', 'Pastries', 'Cookies', 'Cupcakes', 'Desserts'].map(c => <option key={c} value={c}>{c}</option>)}
 </select>
 </div>
 </div>
 <div>
 <label className="block text-sm font-bold text-[#3B2A25] mb-2">Description</label>
 <textarea rows="2" value={productFormData.description} onChange={e => setProductFormData({ ...productFormData, description: e.target.value })} className="w-full px-4 py-3 bg-[#FFF6F2] border border-[#C9A27E] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3B2A25]/30 text-[#3B2A25] resize-none" placeholder="Product description"></textarea>
 </div>
 <div>
 <label className="block text-sm font-bold text-[#3B2A25] mb-2">Images (comma-separated URLs)</label>
 <input type="text" value={productFormData.images} onChange={e => setProductFormData({ ...productFormData, images: e.target.value })} className="w-full px-4 py-3 bg-[#FFF6F2] border border-[#C9A27E] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3B2A25]/30 text-[#3B2A25]" placeholder="https://..." />
 </div>
 <div>
 <label className="block text-sm font-bold text-[#3B2A25] mb-2">Flavors (comma-separated)</label>
 <input type="text" value={productFormData.flavors} onChange={e => setProductFormData({ ...productFormData, flavors: e.target.value })} className="w-full px-4 py-3 bg-[#FFF6F2] border border-[#C9A27E] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3B2A25]/30 text-[#3B2A25]" placeholder="Vanilla, Chocolate" />
 </div>

 <div className="bg-[#FFF6F2] p-5 rounded-2xl border border-[#C9A27E]/50">
 <div className="flex justify-between items-center mb-4">
 <label className="block text-sm font-bold text-[#3B2A25]">Sizes & Prices</label>
 <button type="button" onClick={addSizeField} className="text-xs bg-[#E85D75] text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-[#3A2722] transition-colors">Add Size</button>
 </div>
 {productFormData.sizes.map((s, i) => (
 <div key={i} className="flex gap-3 mb-3 items-center">
 <select value={s.size} onChange={e => handleSizeChange(i, 'size', e.target.value)} className="w-[120px] px-3 py-2 bg-white border border-[#C9A27E] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3B2A25]/30 text-[#3B2A25]">
 <option value="500g">500g</option>
 <option value="1kg">1kg</option>
 <option value="2kg">2kg</option>
 </select>
 <input type="number" required value={s.price} onChange={e => handleSizeChange(i, 'price', Number(e.target.value))} className="flex-1 px-3 py-2 bg-white border border-[#C9A27E] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3B2A25]/30 text-[#3B2A25]" placeholder="Price ₹" />
 {productFormData.sizes.length > 1 && (
 <button type="button" onClick={() => removeSizeField(i)} className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors"><Trash2 className="w-5 h-5" /></button>
 )}
 </div>
 ))}
 </div>

 <button type="submit" className="w-full py-4 bg-[#E85D75] text-white rounded-xl font-bold hover:bg-[#3A2722] transition-colors mt-6 text-lg">
 {currentProduct ? 'Update Product' : 'Create Product'}
 </button>
 </form>
 </motion.div>
 </div>
 )}
 </div>
 );
};

export default AdminDashboard;
