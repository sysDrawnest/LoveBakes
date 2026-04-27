import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
 const { user, logout } = useAuth();
 const { cartCount } = useCart();
 const [menuOpen, setMenuOpen] = useState(false);
 const [userMenuOpen, setUserMenuOpen] = useState(false);
 const [searchOpen, setSearchOpen] = useState(false);
 const [searchQuery, setSearchQuery] = useState('');
 const userMenuRef = useRef(null);
 const searchRef = useRef(null);
 const navigate = useNavigate();
 const location = useLocation();

 useEffect(() => {
 const handleClickOutside = (e) => {
 if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setUserMenuOpen(false);
 if (searchRef.current && !searchRef.current.contains(e.target)) setSearchOpen(false);
 };
 document.addEventListener('mousedown', handleClickOutside);
 return () => document.removeEventListener('mousedown', handleClickOutside);
 }, []);

 useEffect(() => { setMenuOpen(false); }, [location.pathname]);

 const handleLogout = () => {
 logout();
 setUserMenuOpen(false);
 navigate('/');
 };

 const navLinks = [
 { label: 'Home', to: '/' },
 { label: 'Shop', to: '/shop' },
 { label: 'Custom Cake Builder', to: '/custom-cake' },
 { label: 'About Us', to: '/about' },
 { label: 'Reviews', to: '/reviews' },
 { label: 'Contact', to: '/contact' },
 ];

 return (
 <nav className="sticky top-0 z-50 w-full bg-background-light/80 backdrop-blur-md border-b border-primary/10">
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
 <div className="flex justify-between items-center h-20">
 {/* Logo */}
 <Link to="/" className="flex-shrink-0 flex items-center gap-2">
 <div className="bg-brand-accent/10 p-2 rounded-xl">
 <span className="material-symbols-outlined text-brand-accent text-3xl">bakery_dining</span>
 </div>
 <span className="text-2xl font-bold tracking-tight text-brand-brown font-display">
 Love<span className="text-brand-accent">Bakes</span>
 </span>
 </Link>

 {/* Desktop Navigation Links */}
 <div className="hidden lg:flex items-center space-x-8">
 {navLinks.map((link) => (
 <Link
 key={link.to}
 to={link.to}
 className="text-brand-brown/80 hover:text-brand-accent :text-brand-accent transition-colors font-medium text-sm whitespace-nowrap"
 >
 {link.label}
 </Link>
 ))}
 </div>

 {/* Action Icons & CTA */}
 <div className="hidden md:flex items-center gap-4">
 {/* Search */}
 <div className="relative" ref={searchRef}>
 <button
 onClick={() => setSearchOpen(!searchOpen)}
 className="p-2 text-brand-brown/70 hover:text-brand-accent :text-brand-accent transition-all"
 >
 <span className="material-symbols-outlined">search</span>
 </button>
 <AnimatePresence>
 {searchOpen && (
 <motion.div
 initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 1, y: 0 }}
 exit={{ opacity: 0, y: 10 }}
 className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-brand-accent/10 p-2 z-50"
 >
 <div className="flex items-center gap-2 px-3 py-2 bg-background-light rounded-lg">
 <span className="material-symbols-outlined text-sm text-brand-brown/50">search</span>
 <input
 autoFocus
 type="text"
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 placeholder="Search treats..."
 className="bg-transparent border-none outline-none w-full text-sm text-brand-brown "
 />
 </div>
 </motion.div>
 )}
 </AnimatePresence>
 </div>

 {/* User */}
 <div className="relative" ref={userMenuRef}>
 <button
 onClick={() => setUserMenuOpen(!userMenuOpen)}
 className="p-2 text-brand-brown/70 hover:text-brand-accent :text-brand-accent transition-all flex items-center gap-1"
 >
 <span className="material-symbols-outlined">person</span>
 </button>
 <AnimatePresence>
 {userMenuOpen && (
 <motion.div
 initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 1, y: 0 }}
 exit={{ opacity: 0, y: 10 }}
 className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-brand-accent/10 py-2 z-50"
 >
 {user ? (
 <>
 <div className="px-4 py-2 border-b border-brand-accent/10 mb-2">
 <p className="text-sm font-bold text-brand-brown truncate">{user.name}</p>
 <p className="text-xs text-brand-brown/60 truncate">{user.email}</p>
 </div>
 <Link to="/profile" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-brand-brown hover:bg-brand-accent/5 :bg-slate-700">
 <span className="material-symbols-outlined text-[18px]">person</span> Profile
 </Link>
 {user.role === 'admin' && (
 <Link to="/admin" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-brand-brown hover:bg-brand-accent/5 :bg-slate-700">
 <span className="material-symbols-outlined text-[18px]">dashboard</span> Admin
 </Link>
 )}
 <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 :bg-red-900/10 text-left">
 <span className="material-symbols-outlined text-[18px]">logout</span> Logout
 </button>
 </>
 ) : (
 <>
 <Link to="/login" onClick={() => setUserMenuOpen(false)} className="block px-4 py-2 text-sm text-brand-brown hover:bg-brand-accent/5 :bg-slate-700">Login</Link>
 <Link to="/signup" onClick={() => setUserMenuOpen(false)} className="block px-4 py-2 text-sm text-brand-brown hover:bg-brand-accent/5 :bg-slate-700">Sign Up</Link>
 </>
 )}
 </motion.div>
 )}
 </AnimatePresence>
 </div>

 {/* Cart */}
 <Link to="/cart" className="p-2 text-brand-brown/70 hover:text-brand-accent :text-brand-accent transition-all relative">
 <span className="material-symbols-outlined">shopping_cart</span>
 {cartCount > 0 && (
 <span className="absolute top-1 right-1 bg-brand-accent text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
 {cartCount}
 </span>
 )}
 </Link>

 <Link to="/shop" className="ml-4 bg-brand-accent hover:bg-brand-accent/90 text-white px-6 py-2.5 rounded-full font-bold text-sm transition-all shadow-lg shadow-brand-accent/20">
 Order Now
 </Link>
 </div>

 {/* Mobile Menu Button */}
 <div className="lg:hidden flex items-center gap-4">
 <Link to="/cart" className="relative text-brand-brown ">
 <span className="material-symbols-outlined text-2xl">shopping_cart</span>
 {cartCount > 0 && (
 <span className="absolute -top-1 -right-1 bg-brand-accent text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
 {cartCount}
 </span>
 )}
 </Link>
 <button onClick={() => setMenuOpen(!menuOpen)} className="text-brand-brown p-2">
 <span className="material-symbols-outlined text-3xl">{menuOpen ? 'close' : 'menu'}</span>
 </button>
 </div>
 </div>
 </div>

 {/* Mobile Menu Content */}
 <AnimatePresence>
 {menuOpen && (
 <motion.div
 initial={{ opacity: 0, height: 0 }}
 animate={{ opacity: 1, height: 'auto' }}
 exit={{ opacity: 0, height: 0 }}
 className="lg:hidden bg-white border-t border-brand-accent/10 px-4 py-4 space-y-2 shadow-xl"
 >
 {navLinks.map((link) => (
 <Link
 key={link.to}
 to={link.to}
 className="block py-2 text-brand-brown font-medium "
 >
 {link.label}
 </Link>
 ))}
 <div className="border-t border-brand-accent/10 mt-4 pt-4">
 {user ? (
 <>
 <div className="py-2 mb-2 flex items-center justify-between">
 <div>
 <p className="text-sm font-bold text-brand-brown truncate">{user.name}</p>
 <p className="text-xs text-brand-brown/60 truncate">{user.email}</p>
 </div>
 </div>
 <Link to="/profile" className="flex items-center gap-2 py-2 text-brand-brown "><span className="material-symbols-outlined text-[20px]">person</span> Profile</Link>
 {user.role === 'admin' && <Link to="/admin" className="flex items-center gap-2 py-2 text-brand-brown "><span className="material-symbols-outlined text-[20px]">dashboard</span> Admin</Link>}
 <button onClick={handleLogout} className="flex items-center gap-2 py-2 text-red-500 w-full text-left"><span className="material-symbols-outlined text-[20px]">logout</span> Logout</button>
 </>
 ) : (
 <div className="flex gap-4">
 <Link to="/login" className="flex-1 text-center bg-background-light text-brand-brown py-2.5 rounded-lg font-bold">Login</Link>
 <Link to="/signup" className="flex-1 text-center bg-brand-accent text-white py-2.5 rounded-lg font-bold">Sign Up</Link>
 </div>
 )}
 </div>
 </motion.div>
 )}
 </AnimatePresence>
 </nav>
 );
};

export default Navbar;