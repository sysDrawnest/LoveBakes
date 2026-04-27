import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Users,
    Settings,
    LogOut,
    PlusCircle,
    Cake,
    Receipt
} from 'lucide-react';
import { motion } from 'framer-motion';

const Sidebar = () => {
    const navigate = useNavigate();

    const menuItems = [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
        { name: 'Inventory', icon: Package, path: '/admin/products' },
        { name: 'Sales', icon: ShoppingCart, path: '/admin/orders' },
        { name: 'Billing', icon: Receipt, path: '/admin/billing' },
        { name: 'Customers', icon: Users, path: '/admin/users' },
        { name: 'Settings', icon: Settings, path: '/admin/settings' },
    ];

    const handleLogout = () => {
        // Implement logout logic here
        console.log('Logging out...');
        navigate('/login');
    };

    return (
        <div className="hidden lg:flex flex-col w-64 bg-slate-900 text-slate-300 h-screen sticky top-0 border-r border-slate-800 shadow-xl">
            {/* Brand Header */}
            <div className="p-6 flex items-center gap-3 border-b border-slate-800/50">
                <div className="w-10 h-10 bg-gradient-to-br from-[#E1C48C] to-[#C9A84C] rounded-xl flex items-center justify-center shadow-lg shadow-gold/20">
                    <Cake className="text-slate-900 w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                        LoveBakes
                    </h2>
                    <p className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">Admin Suite</p>
                </div>
            </div>

            {/* Quick Action */}
            <div className="px-4 py-6">
                <button
                    onClick={() => navigate('/admin/products/add')}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#C9A84C] to-[#B6963E] hover:from-[#B6963E] hover:to-[#A58531] text-slate-900 font-bold py-2.5 px-4 rounded-lg transition-all duration-300 shadow-lg shadow-gold/10 hover:shadow-gold/20 active:scale-95 group"
                >
                    <PlusCircle size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                    <span>Add Product</span>
                </button>
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 px-3 space-y-1 overflow-y-auto custom-scrollbar">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative
              ${isActive
                                ? 'bg-gradient-to-r from-slate-800 to-transparent text-[#C9A84C] font-medium'
                                : 'hover:bg-slate-800/50 hover:text-white'}
            `}
                    >
                        {({ isActive }) => (
                            <>
                                <item.icon size={20} className={isActive ? 'text-[#C9A84C]' : 'text-slate-400 group-hover:text-white transition-colors'} />
                                <span>{item.name}</span>
                                {isActive && (
                                    <motion.div
                                        layoutId="activeNav"
                                        className="absolute left-0 w-1 h-6 bg-[#C9A84C] rounded-r-full"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.3 }}
                                    />
                                )}
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* Logout Button */}
            <div className="p-4 border-t border-slate-800/50">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-300 group"
                >
                    <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
