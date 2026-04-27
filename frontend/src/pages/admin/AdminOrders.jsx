import { useEffect, useState } from 'react';
import { getAllOrdersApi, updateOrderStatusApi } from '../../api/api';
import { motion } from 'framer-motion';
import {
    ShoppingBag,
    Search,
    Filter,
    Calendar,
    ChevronRight,
    Clock,
    CheckCircle,
    Truck,
    XCircle,
    ExternalLink
} from 'lucide-react';

const ORDER_STATUSES = ['pending', 'accepted', 'preparing', 'out for delivery', 'delivered', 'cancelled'];

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const res = await getAllOrdersApi();
            setOrders(res.data.orders || []);
        } catch (error) {
            console.error('Failed to fetch orders');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (orderId, status) => {
        try {
            await updateOrderStatusApi(orderId, { orderStatus: status });
            setOrders(prev => prev.map(o => o._id === orderId ? { ...o, orderStatus: status } : o));
        } catch (e) {
            alert('Failed to update status');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'bg-amber-50 text-amber-600 border-amber-200';
            case 'accepted': return 'bg-blue-50 text-blue-600 border-blue-200';
            case 'preparing': return 'bg-indigo-50 text-indigo-600 border-indigo-200';
            case 'out for delivery': return 'bg-purple-50 text-purple-600 border-purple-200';
            case 'delivered': return 'bg-emerald-50 text-emerald-600 border-emerald-200';
            case 'cancelled': return 'bg-red-50 text-red-600 border-red-200';
            default: return 'bg-slate-50 text-slate-600 border-slate-200';
        }
    };

    const filteredOrders = orders.filter(o =>
        o._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.user?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Orders</h1>
                <p className="text-slate-500">Track and manage customer orders and fulfillment.</p>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by Order ID or Customer..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-[#C9A84C]/50 text-slate-700"
                    />
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-100 transition-colors">
                    <Filter size={18} />
                    <span>Filter Status</span>
                </button>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                {loading ? (
                    <div className="p-12 flex flex-col items-center justify-center text-slate-400">
                        <div className="w-10 h-10 border-4 border-[#C9A84C]/20 border-t-[#C9A84C] rounded-full animate-spin mb-4" />
                        <p className="font-medium">Loading orders...</p>
                    </div>
                ) : filteredOrders.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50/50 text-slate-500 text-xs uppercase tracking-wider font-semibold">
                                    <th className="px-6 py-4">Order Details</th>
                                    <th className="px-6 py-4">Customer</th>
                                    <th className="px-6 py-4">Total</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filteredOrders.map((o) => (
                                    <tr key={o._id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-mono text-xs font-bold text-[#C9A84C]">#{o._id.slice(-8).toUpperCase()}</span>
                                                <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                                                    <Calendar size={12} />
                                                    {new Date(o.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                                    <span className="mx-1">•</span>
                                                    <Clock size={12} />
                                                    {new Date(o.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-slate-900">{o.user?.name || 'Guest'}</span>
                                                <span className="text-xs text-slate-400">{o.user?.phone || 'No phone'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-bold text-slate-900">₹{o.totalPrice.toLocaleString()}</span>
                                            <p className="text-[10px] text-slate-400 uppercase tracking-tighter">{o.paymentMethod}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <select
                                                value={o.orderStatus}
                                                onChange={e => handleStatusChange(o._id, e.target.value)}
                                                className={`text-xs font-bold px-3 py-1.5 rounded-full border transition-all focus:outline-none focus:ring-2 focus:ring-slate-900/5 cursor-pointer ${getStatusColor(o.orderStatus)}`}
                                            >
                                                {ORDER_STATUSES.map(s => (
                                                    <option key={s} value={s} className="bg-white text-slate-900">{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all">
                                                <ChevronRight size={20} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-20 text-center">
                        <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-300">
                            <ShoppingBag size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-1">No orders found</h3>
                        <p className="text-slate-500">Try searching for a different order ID or customer name.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminOrders;
