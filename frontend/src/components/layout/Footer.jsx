import { Link } from 'react-router-dom';
import { Instagram, Heart, Phone, MapPin, Mail } from 'lucide-react';

const Footer = () => (
    <footer className="bg-[#4A332C] text-[#F1DEC9] mt-20">
        <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
            {/* Brand */}
            <div>
                <h3 className="text-2xl font-bold text-white mb-3">LoveBakes 🍰</h3>
                <p className="text-sm text-[#C8B6A6] leading-relaxed">Homemade cakes, pastries and desserts crafted with love. Started with one imperfect cake for the girl he loved.</p>
                <div className="flex gap-3 mt-4">
                    <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                        <Instagram className="w-4 h-4" />
                    </a>
                    <a href="https://wa.me/919999999999" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors text-xs font-bold">WA</a>
                </div>
            </div>

            {/* Quick Links */}
            <div>
                <h4 className="font-semibold text-white mb-4">Quick Links</h4>
                <ul className="space-y-2 text-sm text-[#C8B6A6]">
                    {['/', '/shop', '/custom-cake', '/about'].map((path, i) => (
                        <li key={i}><Link to={path} className="hover:text-white transition-colors">{['Home', 'Shop', 'Custom Cake', 'About Us'][i]}</Link></li>
                    ))}
                </ul>
            </div>

            {/* Menu */}
            <div>
                <h4 className="font-semibold text-white mb-4">Menu</h4>
                <ul className="space-y-2 text-sm text-[#C8B6A6]">
                    {['Cakes', 'Custom Cakes', 'Cupcakes', 'Pastries', 'Cookies', 'Desserts'].map(c => (
                        <li key={c}><Link to={`/shop?category=${c}`} className="hover:text-white transition-colors">{c}</Link></li>
                    ))}
                </ul>
            </div>

            {/* Contact */}
            <div>
                <h4 className="font-semibold text-white mb-4">Contact Us</h4>
                <ul className="space-y-3 text-sm text-[#C8B6A6]">
                    <li className="flex items-start gap-2"><MapPin className="w-4 h-4 mt-0.5 shrink-0" />Bhubaneswar, Odisha, India</li>
                    <li className="flex items-center gap-2"><Phone className="w-4 h-4 shrink-0" />+91 99999 99999</li>
                    <li className="flex items-center gap-2"><Mail className="w-4 h-4 shrink-0" />hello@lovebakes.in</li>
                </ul>
            </div>
        </div>
        <div className="border-t border-white/10 py-5 text-center text-xs text-[#C8B6A6]">
            <p>© {new Date().getFullYear()} LoveBakes. Made with <Heart className="inline w-3 h-3 text-pink-400 mx-1" /> in Odisha.</p>
        </div>
    </footer>
);

export default Footer;
