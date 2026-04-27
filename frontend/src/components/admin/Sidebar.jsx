import React, { useState } from 'react';
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
    Receipt,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
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
        console.log('Logging out...');
        navigate('/login');
    };

    return (
        <motion.div
            initial={false}
            animate={{ width: isCollapsed ? 80 : 256 }}
            className="hidden lg:flex flex-col bg-slate-900 text-slate-300 h-screen sticky top-0 border-r border-slate-800 shadow-xl transition-all duration-300 ease-in-out relative z-40"
        >
            {/* Toggle Button */}
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="absolute -right-3 top-20 w-6 h-6 bg-[#C9A84C] text-slate-900 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform z-50 border-2 border-slate-900"
            >
                {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            </button>

            {/* Brand Header */}
            <div className={`p-6 flex items-center gap-3 border-b border-slate-800/50 overflow-hidden ${isCollapsed ? 'justify-center' : ''}`}>
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-[#E1C48C] to-[#C9A84C] rounded-xl flex items-center justify-center shadow-lg shadow-gold/20">
                    <Cake className="text-slate-900 w-6 h-6" />
                </div>
                {!isCollapsed && (
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="whitespace-nowrap"
                    >
                        <h2 className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                            LoveBakes
                        </h2>
                        <p className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">Admin Suite</p>
                    </motion.div>
                )}
            </div>

            {/* Quick Action */}
            <div className={`px-4 py-6 overflow-hidden ${isCollapsed ? 'flex justify-center' : ''}`}>
                <button
                    onClick={() => navigate('/admin/products/add')}
                    className={`flex items-center justify-center gap-2 bg-gradient-to-r from-[#C9A84C] to-[#B6963E] hover:from-[#B6963E] hover:to-[#A58531] text-slate-900 font-bold rounded-lg transition-all duration-300 shadow-lg shadow-gold/10 hover:shadow-gold/20 active:scale-95 group ${isCollapsed ? 'w-10 h-10 p-0' : 'w-full py-2.5 px-4'}`}
                    title={isCollapsed ? "Add Product" : ""}
                >
                    <PlusCircle size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                    {!isCollapsed && <span className="whitespace-nowrap">Add Product</span>}
                </button>
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 px-3 space-y-1 overflow-y-auto custom-scrollbar overflow-x-hidden">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => `
                            flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative
                            ${isActive
                                ? 'bg-gradient-to-r from-slate-800 to-transparent text-[#C9A84C] font-medium'
                                : 'hover:bg-slate-800/50 hover:text-white'}
                            ${isCollapsed ? 'justify-center px-0' : ''}
                        `}
                        title={isCollapsed ? item.name : ""}
                    >
                        {({ isActive }) => (
                            <>
                                <item.icon size={20} className={isActive ? 'text-[#C9A84C]' : 'text-slate-400 group-hover:text-white transition-colors'} />
                                {!isCollapsed && (
                                    <motion.span
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="whitespace-nowrap"
                                    >
                                        {item.name}
                                    </motion.span>
                                )}
                                {isActive && !isCollapsed && (
                                    <motion.div
                                        layoutId="activeNav"
                                        className="absolute left-0 w-1 h-6 bg-[#C9A84C] rounded-r-full"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.3 }}
                                    />
                                )}
                                {isActive && isCollapsed && (
                                    <div className="absolute left-0 w-1 h-6 bg-[#C9A84C] rounded-r-full" />
                                )}
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* Logout Button */}
            <div className={`p-4 border-t border-slate-800/50 overflow-hidden ${isCollapsed ? 'flex justify-center' : ''}`}>
                <button
                    onClick={handleLogout}
                    className={`flex items-center gap-3 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-300 group ${isCollapsed ? 'w-10 h-10 justify-center' : 'w-full px-4 py-3'}`}
                    title={isCollapsed ? "Logout" : ""}
                >
                    <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
                    {!isCollapsed && <span className="font-medium whitespace-nowrap">Logout</span>}
                </button>
            </div>
        </motion.div>
    );
};

export default Sidebar;
