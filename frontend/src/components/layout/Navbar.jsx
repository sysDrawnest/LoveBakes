import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, LogOut, LayoutDashboard } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { cartCount } = useCart();
    const [menuOpen, setMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        setUserMenuOpen(false);
        navigate('/');
    };

    const navLinks = [
        { label: 'Home', to: '/' },
        { label: 'Shop', to: '/shop' },
        { label: 'Custom Cake', to: '/custom-cake' },
        { label: 'About', to: '/about' },
    ];

    return (
        <header className="bg-white/95 backdrop-blur-sm shadow-[0_2px_20px_rgba(74,51,44,0.08)] sticky top-0 z-50 w-full">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2">
                    <span className="text-2xl font-bold bg-gradient-to-r from-[#4A332C] to-[#C8B6A6] bg-clip-text text-transparent">
                        LoveBakes 🍰
                    </span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8">
                    {navLinks.map(l => (
                        <Link key={l.to} to={l.to} className="text-[#4A332C]/80 hover:text-[#4A332C] font-medium transition-colors">
                            {l.label}
                        </Link>
                    ))}
                </nav>

                {/* Right Side Actions */}
                <div className="flex items-center gap-3">
                    {/* Cart */}
                    <Link to="/cart" className="relative p-2 rounded-full hover:bg-[#FFD8D8]/30 transition-colors">
                        <ShoppingCart className="w-5 h-5 text-[#4A332C]" />
                        {cartCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-[#4A332C] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                                {cartCount}
                            </span>
                        )}
                    </Link>

                    {/* User Menu */}
                    {user ? (
                        <div className="relative">
                            <button
                                onClick={() => setUserMenuOpen(!userMenuOpen)}
                                className="flex items-center gap-2 p-2 rounded-full hover:bg-[#FFD8D8]/30 transition-colors"
                            >
                                <User className="w-5 h-5 text-[#4A332C]" />
                                <span className="hidden md:block text-sm font-medium text-[#4A332C]">{user.name.split(' ')[0]}</span>
                            </button>
                            <AnimatePresence>
                                {userMenuOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-[#F1DEC9] py-2 z-50"
                                    >
                                        <Link to="/profile" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-[#4A332C] hover:bg-[#FFFDF9]">
                                            <User className="w-4 h-4" /> My Profile
                                        </Link>
                                        {user.role === 'admin' && (
                                            <Link to="/admin" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-[#4A332C] hover:bg-[#FFFDF9]">
                                                <LayoutDashboard className="w-4 h-4" /> Admin Panel
                                            </Link>
                                        )}
                                        <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 w-full text-left">
                                            <LogOut className="w-4 h-4" /> Logout
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <Link to="/login" className="hidden md:inline-flex items-center gap-1 bg-[#4A332C] text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-[#2C1A14] transition-colors">
                            Login
                        </Link>
                    )}

                    {/* Mobile Menu Toggle */}
                    <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 rounded-full hover:bg-[#FFD8D8]/30">
                        {menuOpen ? <X className="w-5 h-5 text-[#4A332C]" /> : <Menu className="w-5 h-5 text-[#4A332C]" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white border-t border-[#F1DEC9] px-4 pb-4"
                    >
                        {navLinks.map(l => (
                            <Link
                                key={l.to} to={l.to}
                                onClick={() => setMenuOpen(false)}
                                className="block py-3 text-[#4A332C] font-medium border-b border-[#F1DEC9]/50 last:border-0"
                            >
                                {l.label}
                            </Link>
                        ))}
                        {!user && (
                            <Link to="/login" onClick={() => setMenuOpen(false)} className="mt-3 flex justify-center bg-[#4A332C] text-white py-2 rounded-full font-semibold">
                                Login
                            </Link>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Navbar;
