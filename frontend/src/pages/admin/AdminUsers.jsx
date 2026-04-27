import { useEffect, useState } from 'react';
import { getAllUsersApi } from '../../api/api';
import { motion } from 'framer-motion';
import {
    Users,
    Search,
    Mail,
    Phone,
    Calendar,
    Shield,
    User as UserIcon,
    MoreVertical,
    MapPin
} from 'lucide-react';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const res = await getAllUsersApi();
            setUsers(res.data || []);
        } catch (error) {
            console.error('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = users.filter(u =>
        u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Customers</h1>
                <p className="text-slate-500">View and manage your registered customer base.</p>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-[#C9A84C]/50 text-slate-700 outline-none"
                    />
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                {loading ? (
                    <div className="p-12 flex flex-col items-center justify-center text-slate-400">
                        <div className="w-10 h-10 border-4 border-[#C9A84C]/20 border-t-[#C9A84C] rounded-full animate-spin mb-4" />
                        <p className="font-medium">Loading customers...</p>
                    </div>
                ) : filteredUsers.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50/50 text-slate-500 text-xs uppercase tracking-wider font-semibold">
                                    <th className="px-6 py-4">Customer Info</th>
                                    <th className="px-6 py-4">Contact</th>
                                    <th className="px-6 py-4">Role</th>
                                    <th className="px-6 py-4">Joined</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filteredUsers.map((u) => (
                                    <tr key={u._id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200">
                                                    <UserIcon size={20} />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900">{u.name}</p>
                                                    <p className="text-xs text-slate-400">ID: ...{u._id?.slice(-6)}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                                    <Mail size={14} className="text-slate-400" />
                                                    {u.email}
                                                </div>
                                                {u.phone && (
                                                    <div className="flex items-center gap-2 text-sm text-slate-600">
                                                        <Phone size={14} className="text-slate-400" />
                                                        {u.phone}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${u.role === 'admin'
                                                    ? 'bg-purple-50 text-purple-600 border-purple-100'
                                                    : 'bg-blue-50 text-blue-600 border-blue-100'
                                                }`}>
                                                <Shield size={12} />
                                                {u.role.charAt(0).toUpperCase() + u.role.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                                <Calendar size={14} className="text-slate-400" />
                                                {new Date(u.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all">
                                                <MoreVertical size={18} />
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
                            <Users size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-1">No customers found</h3>
                        <p className="text-slate-500">Try searching for a different name or email.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminUsers;
