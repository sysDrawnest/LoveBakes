import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMyOrdersApi } from '../api/api';
import { motion } from 'framer-motion';
import { Package, Clock, CheckCircle, Truck } from 'lucide-react';

const STATUS_ICON = {
    pending: <Clock className="w-4 h-4 text-yellow-500" />,
    accepted: <CheckCircle className="w-4 h-4 text-blue-500" />,
    preparing: <Package className="w-4 h-4 text-purple-500" />,
    'out for delivery': <Truck className="w-4 h-4 text-orange-500" />,
    delivered: <CheckCircle className="w-4 h-4 text-green-500" />,
    cancelled: <CheckCircle className="w-4 h-4 text-red-500" />,
};

const Profile = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) { navigate('/login'); return; }
        getMyOrdersApi()
            .then(r => setOrders(r.data))
            .catch(() => { })
            .finally(() => setLoading(false));
    }, [user]);

    return (
        <div className="max-w-3xl mx-auto px-4 py-12">
            {/* Profile Header */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl p-8 shadow-[0_8px_40px_rgba(74,51,44,0.08)] mb-8 flex items-center gap-6">
                <div className="w-16 h-16 rounded-full bg-[#3B2A25] flex items-center justify-center text-white text-2xl font-bold">
                    {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                    <h2 className="text-2xl font-bold text-[#3B2A25]">{user?.name}</h2>
                    <p className="text-[#C9A27E]">{user?.email}</p>
                    {user?.phone && <p className="text-[#C9A27E] text-sm">{user.phone}</p>}
                </div>
                <button onClick={() => { logout(); navigate('/'); }}
                    className="text-sm text-red-400 hover:text-red-600 font-medium border border-red-200 px-4 py-2 rounded-full hover:bg-red-50 transition-colors">
                    Logout
                </button>
            </motion.div>

            {/* Order History */}
            <h2 className="text-2xl font-bold text-[#3B2A25] mb-5">Order History</h2>

            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map(i => <div key={i} className="bg-white rounded-2xl h-28 animate-pulse" />)}
                </div>
            ) : orders.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
                    <div className="text-5xl mb-4">🧁</div>
                    <p className="text-[#3B2A25] font-medium text-lg">No orders yet!</p>
                    <p className="text-[#C9A27E] text-sm mt-1">Order your first cake today.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map(order => (
                        <motion.div key={order._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-2xl p-5 shadow-[0_4px_20px_rgba(74,51,44,0.06)]">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <p className="text-xs text-[#C9A27E] font-mono">#{order._id.slice(-8).toUpperCase()}</p>
                                    <p className="font-bold text-[#3B2A25]">₹{order.totalPrice}</p>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    {STATUS_ICON[order.orderStatus] || STATUS_ICON.pending}
                                    <span className="text-sm capitalize font-medium text-[#3B2A25]">{order.orderStatus}</span>
                                </div>
                            </div>
                            <div className="text-sm text-[#3B2A25]/70">
                                <span>{order.items?.length} item(s) • </span>
                                <span>Delivery: {new Date(order.deliveryDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Profile;
