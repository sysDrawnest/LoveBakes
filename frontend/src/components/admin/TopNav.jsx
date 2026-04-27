import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    Menu,
    X,
    LayoutDashboard,
    Package,
    ShoppingCart,
    Users,
    Settings,
    LogOut,
    Cake,
    PlusCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TopNav = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const menuItems = [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
        { name: 'Inventory', icon: Package, path: '/admin/products' },
        { name: 'Sales', icon: ShoppingCart, path: '/admin/orders' },
        { name: 'Customers', icon: Users, path: '/admin/users' },
        { name: 'Settings', icon: Settings, path: '/admin/settings' },
    ];

    const handleLogout = () => {
        // Implement logout logic here
        console.log('Logging out...');
        navigate('/login');
    };

    return (
        <div className="lg:hidden w-full bg-slate-900 text-slate-300 border-b border-slate-800 sticky top-0 z-50">
            <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-[#E1C48C] to-[#C9A84C] rounded-lg flex items-center justify-center">
                        <Cake size={18} className="text-slate-900" />
                    </div>
                    <span className="text-lg font-bold text-white">LoveBakes</span>
                </div>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="border-t border-slate-800 bg-slate-900 overflow-hidden"
                    >
                        <div className="px-4 py-4 space-y-2">
                            <button
                                onClick={() => {
                                    navigate('/admin/products/add');
                                    setIsOpen(false);
                                }}
                                className="w-full flex items-center justify-center gap-2 bg-[#C9A84C] text-slate-900 font-bold py-2 rounded-lg mb-4"
                            >
                                <PlusCircle size={18} />
                                <span>Add Product</span>
                            </button>

                            {menuItems.map((item) => (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setIsOpen(false)}
                                    className={({ isActive }) => `
                    flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                    ${isActive ? 'bg-slate-800 text-[#C9A84C]' : 'hover:bg-slate-800/50'}
                  `}
                                >
                                    <item.icon size={20} />
                                    <span>{item.name}</span>
                                </NavLink>
                            ))}

                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-slate-400 border-t border-slate-800 mt-2"
                            >
                                <LogOut size={20} />
                                <span>Logout</span>
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default TopNav;
