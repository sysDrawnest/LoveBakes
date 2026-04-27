import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, Phone, Eye, EyeOff, Sparkles, Heart, HelpCircle } from 'lucide-react';

const Login = () => {
    const { login, register: registerUser } = useAuth();
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const [mode, setMode] = useState('login');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const switchMode = (m) => {
        setMode(m);
        setError('');
        reset();
    };

    const onSubmit = async (data) => {
        setLoading(true);
        setError('');
        try {
            if (mode === 'login') {
                await login(data.email, data.password);
            } else {
                await registerUser(data.name, data.email, data.password, data.phone);
            }
            navigate('/');
        } catch (e) {
            console.error('Auth Error:', e);
            setError(e.response?.data?.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-bakery-scene flex flex-col font-body antialiased relative overflow-hidden">
            {/* External Fonts and Symbols Head Injection Equivalent via style tag for now if not in index.html */}
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Noto+Serif:ital,wght@0,400;0,700;1,400&family=Be+Vietnam+Pro:wght@400;500;600;700&display=swap');
                
                .glass-panel {
                    background: rgba(255, 255, 255, 0.7);
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                    border: 1px solid rgba(62, 39, 35, 0.1);
                }
                
                .shadow-bakery {
                    box-shadow: 0 30px 60px -12px rgba(62, 39, 35, 0.15);
                }

                @keyframes float {
                    0%, 100% { transform: translateY(0) rotate(0deg); }
                    50% { transform: translateY(-20px) rotate(10deg); }
                }
                .floating-emoji { animation: float 6s ease-in-out infinite; }
            `}</style>

            {/* Header / Top Navigation Anchor */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-lg border-b border-white/30 flex justify-between items-center px-8 h-20 w-full max-w-7xl mx-auto shadow-[0_20px_50px_rgba(62,39,35,0.05)]">
                <div className="text-2xl font-display italic text-[#3E2723]">L'Amour Sucré</div>
                <div className="flex items-center gap-6">
                    <HelpCircle className="text-[#3E2723] cursor-pointer hover:opacity-80 transition-opacity" size={24} />
                </div>
            </header>

            {/* Main Auth Canvas */}
            <main className="flex-1 w-full flex items-center justify-center p-6 mt-20 relative">
                {/* Floating Decorative Elements */}
                <div className="absolute top-[15%] right-[15%] hidden lg:block floating-emoji text-6xl select-none">🧁</div>
                <div className="absolute bottom-[20%] left-[10%] hidden lg:block floating-emoji text-5xl select-none" style={{ animationDelay: '-2s' }}>🥐</div>

                {/* Auth Card Container */}
                <div className="w-full max-w-[480px] z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-panel rounded-xxl shadow-bakery p-8 md:p-12 flex flex-col items-center"
                    >
                        {/* Brand Header */}
                        <div className="mb-10 text-center">
                            <h1 className="font-display text-4xl md:text-5xl text-primary mb-2">LoveBakes</h1>
                            <p className="font-body text-on-surface-variant italic">Every bite is a love letter.</p>
                        </div>

                        {/* Mode Toggle (Pill Switcher) */}
                        <div className="relative w-full max-w-[320px] bg-secondary-container/50 p-1.5 rounded-full mb-10 flex">
                            <motion.div
                                className="absolute inset-y-1.5 left-1.5 w-[calc(50%-6px)] bg-white rounded-full shadow-sm"
                                animate={{ x: mode === 'login' ? 0 : '100.5%' }}
                                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            />
                            <button
                                onClick={() => switchMode('login')}
                                className={`relative z-10 flex-1 py-2 text-sm font-semibold transition-colors ${mode === 'login' ? 'text-primary' : 'text-on-surface-variant'}`}
                            >
                                Login
                            </button>
                            <button
                                onClick={() => switchMode('register')}
                                className={`relative z-10 flex-1 py-2 text-sm font-semibold transition-colors ${mode === 'register' ? 'text-primary' : 'text-on-surface-variant'}`}
                            >
                                Sign Up
                            </button>
                        </div>

                        {/* Error Notification */}
                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="w-full mb-6 p-4 bg-error-container text-on-error-container rounded-xl text-sm flex items-center gap-2"
                                >
                                    <span>⚠️</span> {error}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Form Section */}
                        <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
                            <AnimatePresence mode="wait">
                                {mode === 'register' && (
                                    <motion.div
                                        key="register-fields"
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="space-y-6 overflow-hidden"
                                    >
                                        <div className="space-y-2">
                                            <label className="block text-sm font-semibold text-on-surface-variant ml-2">Full Name</label>
                                            <div className="relative">
                                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-tertiary" size={20} />
                                                <input
                                                    {...register('name', { required: mode === 'register' })}
                                                    className={`w-full pl-12 pr-4 py-4 bg-surface-container rounded-xl border-2 transition-all outline-none font-body text-on-surface placeholder:text-outline-variant ${errors.name ? 'border-error' : 'border-transparent focus:border-primary-container'}`}
                                                    placeholder="Your full name"
                                                    type="text"
                                                />
                                            </div>
                                            {errors.name && <p className="text-xs text-error ml-2">Name is required</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <label className="block text-sm font-semibold text-on-surface-variant ml-2 text-sm italic">Phone <span className="opacity-60">(optional)</span></label>
                                            <div className="relative">
                                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-tertiary" size={20} />
                                                <input
                                                    {...register('phone')}
                                                    className="w-full pl-12 pr-4 py-4 bg-surface-container rounded-xl border-2 border-transparent focus:border-primary-container transition-all outline-none font-body text-on-surface placeholder:text-outline-variant"
                                                    placeholder="+91 XXXXX XXXXX"
                                                    type="tel"
                                                />
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-on-surface-variant ml-2">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-tertiary" size={20} />
                                    <input
                                        {...register('email', { required: true, pattern: /^\S+@\S+\.\S+$/ })}
                                        className={`w-full pl-12 pr-4 py-4 bg-surface-container rounded-xl border-2 transition-all outline-none font-body text-on-surface placeholder:text-outline-variant ${errors.email ? 'border-error' : 'border-transparent focus:border-primary-container'}`}
                                        placeholder="heart@lovebakes.com"
                                        type="email"
                                    />
                                </div>
                                {errors.email && <p className="text-xs text-error ml-2">Valid email required</p>}
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center px-2">
                                    <label className="text-sm font-semibold text-on-surface-variant">Password</label>
                                    <button type="button" className="text-sm text-primary font-semibold hover:underline decoration-primary-container">Forgot?</button>
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-tertiary" size={20} />
                                    <input
                                        {...register('password', { required: true, minLength: 6 })}
                                        className={`w-full pl-12 pr-12 py-4 bg-surface-container rounded-xl border-2 transition-all outline-none font-body text-on-surface placeholder:text-outline-variant ${errors.password ? 'border-error' : 'border-transparent focus:border-primary-container'}`}
                                        placeholder="••••••••"
                                        type={showPassword ? 'text' : 'password'}
                                    />
                                    <button
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-primary transition-colors"
                                        type="button"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                                {errors.password && <p className="text-xs text-error ml-2">Minimum 6 characters</p>}
                            </div>

                            <button
                                disabled={loading}
                                className="w-full py-4 bg-gradient-to-r from-primary-container to-[#F8C8DC] text-[#765162] font-bold text-lg rounded-xl shadow-lg shadow-primary-container/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2"
                                type="submit"
                            >
                                {loading ? (
                                    <motion.span animate={{ opacity: [1, 0.5, 1] }} transition={{ repeat: Infinity, duration: 1 }}>Please wait...</motion.span>
                                ) : (
                                    <>{mode === 'login' ? 'Sign In to Your Kitchen' : 'Create Your Cupcake Access'}</>
                                )}
                            </button>

                            {/* Divider */}
                            <div className="relative py-4 flex items-center gap-4">
                                <div className="h-px flex-1 bg-outline-variant/30"></div>
                                <span className="text-xs text-outline italic font-semibold">or continue with</span>
                                <div className="h-px flex-1 bg-outline-variant/30"></div>
                            </div>

                            {/* Social Login */}
                            <button className="w-full py-3.5 bg-white/50 border border-outline-variant/30 rounded-xl flex items-center justify-center gap-3 hover:bg-white/80 transition-all active:scale-[0.98]" type="button">
                                <img alt="Google Logo" className="w-5 h-5" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAN042BZL8LIOABNpTb9qJ2HM6hvRzWOcNrH-ygY-UsqSzRlzpliig6toappkYmMGoBlqZhIys0YDFv0AwROq_nFFKIZgOU52jdOZ8y2AtaSNl5YhEddxIXCsMhDbqT6HqJp8hWoh2ffFmAdY4G9sqo_dGR1swurw9c1CrZvcKIQyp6NRWqxSyugvPJgzfNUIOJP16On7sxUelWF29_8wDX4bFXmShxHjEh8sgS-C668VVc2PNb6-q4HHIVlcnrjuJMf4ZnfTMvuQ" />
                                <span className="text-sm text-on-surface font-semibold">Google Account</span>
                            </button>
                        </form>

                        {/* Flavor Note / Ingredient Highlight */}
                        <div className="mt-10 p-4 rounded-2xl glass-panel bg-white/40 border-dashed border-[#F8C8DC] flex items-center gap-3 w-full">
                            <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center">
                                <Heart className="text-primary" size={20} fill="currentColor" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-primary">Artisan Secret</p>
                                <p className="text-xs text-on-tertiary-fixed-variant">We use only Madagascar vanilla in our auth systems.</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-[#F5F5F0] py-12 border-t border-[#3E2723]/10 flex flex-col items-center justify-center space-y-4 w-full relative z-10">
                <div className="flex gap-8">
                    <a className="font-serif text-sm italic text-[#3E2723]/70 hover:text-[#F8C8DC] transition-colors underline decoration-[#F8C8DC]" href="#">Privacy</a>
                    <a className="font-serif text-sm italic text-[#3E2723]/70 hover:text-[#F8C8DC] transition-colors" href="#">Terms</a>
                    <a className="font-serif text-sm italic text-[#3E2723]/70 hover:text-[#F8C8DC] transition-colors" href="#">Contact</a>
                </div>
                <p className="font-serif text-sm italic text-[#3E2723]">© 2024 L'Amour Sucré. Crafted with affection.</p>
            </footer>
        </div>
    );
};

export default Login;