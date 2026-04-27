import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const BottomNav = () => {
    const { user } = useAuth();
    const { cartCount } = useCart();
    const location = useLocation();

    return (
        <nav className="md:hidden fixed bottom-0 z-50 w-full flex bg-white/90 backdrop-blur-md border-t border-[#E85D75]/10 px-4 pb-6 pt-3 safe-area-bottom">
            <Link to="/" className={`flex flex-1 flex-col items-center justify-center gap-1 ${location.pathname === '/' ? 'text-[#E85D75]' : 'text-gray-400'}`}>
                <span className={`material-symbols-outlined ${location.pathname === '/' ? 'fill-1' : ''}`}>home</span>
                <p className="text-[10px] font-bold uppercase tracking-widest">Home</p>
            </Link>

            <Link to="/shop" className={`flex flex-1 flex-col items-center justify-center gap-1 ${location.pathname === '/shop' ? 'text-[#E85D75]' : 'text-gray-400'}`}>
                <span className={`material-symbols-outlined ${location.pathname === '/shop' ? 'fill-1' : ''}`}>menu_book</span>
                <p className="text-[10px] font-bold uppercase tracking-widest">Menu</p>
            </Link>

            <Link to="/cart" className={`flex flex-1 flex-col items-center justify-center gap-1 ${location.pathname === '/cart' ? 'text-[#E85D75]' : 'text-gray-400'}`}>
                <div className="relative">
                    <span className={`material-symbols-outlined ${location.pathname === '/cart' ? 'fill-1' : ''}`}>shopping_basket</span>
                    {cartCount > 0 && (
                        <span className="absolute -top-1 -right-2 bg-[#E85D75] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full flex items-center justify-center">
                            {cartCount}
                        </span>
                    )}
                </div>
                <p className="text-[10px] font-bold uppercase tracking-widest">Orders</p>
            </Link>

            <Link to={user ? "/profile" : "/login"} className={`flex flex-1 flex-col items-center justify-center gap-1 ${['/profile', '/login', '/signup'].includes(location.pathname) ? 'text-[#E85D75]' : 'text-gray-400'}`}>
                <span className={`material-symbols-outlined ${['/profile', '/login', '/signup'].includes(location.pathname) ? 'fill-1' : ''}`}>person</span>
                <p className="text-[10px] font-bold uppercase tracking-widest">Profile</p>
            </Link>

            <style>{`
                .fill-1 { font-variation-settings: 'FILL' 1; }
                .safe-area-bottom { padding-bottom: calc(1.5rem + env(safe-area-inset-bottom, 0px)); }
            `}</style>
        </nav>
    );
};

export default BottomNav;
