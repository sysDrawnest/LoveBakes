import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getAnalyticsApi } from '../../api/api';
import { motion } from 'framer-motion';
import { Package, Users, TrendingUp, ShoppingBag } from 'lucide-react';

const AdminDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/');
            return;
        }

        getAnalyticsApi()
            .then(r => setAnalytics(r.data))
            .catch(() => {
                console.error('Failed to fetch analytics');
            })
            .finally(() => setLoading(false));
    }, [user, navigate]);

    if (!user || user.role !== 'admin') return null;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome back, {user.name}! 👋</h1>
                <p className="text-slate-500">Here's what's happening with LoveBakes today.</p>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="bg-white rounded-2xl h-32 shadow-sm border border-slate-100" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        {
                            icon: <ShoppingBag size={24} />,
                            label: 'Total Orders',
                            value: analytics?.totalOrders || 0,
                            color: 'bg-blue-50 text-blue-600'
                        },
                        {
                            icon: <Package size={24} />,
                            label: "Today's Orders",
                            value: analytics?.todayOrders || 0,
                            color: 'bg-amber-50 text-amber-600'
                        },
                        {
                            icon: <Users size={24} />,
                            label: 'Total Users',
                            value: analytics?.totalUsers || 0,
                            color: 'bg-purple-50 text-purple-600'
                        },
                        {
                            icon: <TrendingUp size={24} />,
                            label: 'Total Revenue',
                            value: `₹${analytics?.totalRevenue?.toLocaleString('en-IN') || 0}`,
                            color: 'bg-emerald-50 text-emerald-600'
                        },
                    ].map((s, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
                        >
                            <div className={`w-12 h-12 rounded-xl ${s.color} flex items-center justify-center mb-4`}>
                                {s.icon}
                            </div>
                            <p className="text-sm font-medium text-slate-500 mb-1">{s.label}</p>
                            <p className="text-2xl font-bold text-slate-900">{s.value}</p>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Tables or charts could go here next */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <TrendingUp className="text-[#C9A84C]" size={20} />
                        Recent Sales Activity
                    </h3>
                    {analytics?.dailySales?.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="text-left text-slate-400 border-b border-slate-100">
                                        <th className="pb-3 pr-4 font-medium italic">Date</th>
                                        <th className="pb-3 pr-4 font-medium italic">Orders</th>
                                        <th className="pb-3 font-medium italic">Revenue</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {analytics.dailySales.map(d => (
                                        <tr key={d._id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="py-4 pr-4 font-medium text-slate-700">{d._id}</td>
                                            <td className="py-4 pr-4">
                                                <span className="bg-slate-100 px-2 py-1 rounded text-slate-600 text-xs font-bold">{d.count}</span>
                                            </td>
                                            <td className="py-4 font-bold text-slate-900">₹{d.revenue.toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : <p className="text-slate-400 text-sm py-10 text-center italic">No sales data recorded yet.</p>}
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <ShoppingBag className="text-[#C9A84C]" size={20} />
                        Popular Products
                    </h3>
                    {analytics?.popularProducts?.length > 0 ? (
                        <div className="space-y-4">
                            {analytics.popularProducts.map((p, i) => (
                                <div key={i} className="flex justify-between items-center group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-[#C9A84C]/10 flex items-center justify-center text-[#C9A84C] font-bold text-xs">
                                            {i + 1}
                                        </div>
                                        <span className="text-slate-700 font-medium group-hover:text-[#C9A84C] transition-colors">{p.name || `Product #${i + 1}`}</span>
                                    </div>
                                    <span className="font-bold text-slate-900 bg-slate-100 px-3 py-1 rounded-full text-xs">{p.count} sold</span>
                                </div>
                            ))}
                        </div>
                    ) : <p className="text-slate-400 text-sm py-10 text-center italic">Best sellers will appear here.</p>}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
