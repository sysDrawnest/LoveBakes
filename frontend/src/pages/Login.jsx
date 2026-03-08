import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const { login, register: registerUser } = useAuth();
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [mode, setMode] = useState('login'); // 'login' | 'register'
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

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
            setError(e.response?.data?.message || 'Something went wrong. Please try again.');
        } finally { setLoading(false); }
    };

    return (
        <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
            <motion.div
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                className="bg-white w-full max-w-md rounded-3xl shadow-[0_20px_60px_rgba(74,51,44,0.12)] p-8 md:p-10"
            >
                {/* Logo */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-[#4A332C]">LoveBakes 🍰</h1>
                    <p className="text-[#C8B6A6] text-sm mt-1">{mode === 'login' ? 'Welcome back!' : 'Create your account'}</p>
                </div>

                {/* Tab Toggle */}
                <div className="flex bg-[#F1DEC9]/40 rounded-full p-1 mb-8">
                    {['login', 'register'].map(m => (
                        <button key={m} onClick={() => { setMode(m); setError(''); }}
                            className={`flex-1 py-2.5 rounded-full text-sm font-semibold capitalize transition-all ${mode === m ? 'bg-[#4A332C] text-white shadow' : 'text-[#C8B6A6]'}`}>
                            {m === 'login' ? 'Login' : 'Sign Up'}
                        </button>
                    ))}
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-5">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {mode === 'register' && (
                        <>
                            <div>
                                <label className="block text-sm font-semibold text-[#4A332C] mb-1.5">Full Name</label>
                                <input {...register('name', { required: mode === 'register' })} placeholder="Your name"
                                    className="w-full border border-[#F1DEC9] rounded-xl px-4 py-3 text-[#4A332C] focus:outline-none focus:ring-2 focus:ring-[#4A332C]/20" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-[#4A332C] mb-1.5">Phone</label>
                                <input {...register('phone')} placeholder="+91 XXXXX XXXXX"
                                    className="w-full border border-[#F1DEC9] rounded-xl px-4 py-3 text-[#4A332C] focus:outline-none" />
                            </div>
                        </>
                    )}

                    <div>
                        <label className="block text-sm font-semibold text-[#4A332C] mb-1.5">Email</label>
                        <input {...register('email', { required: true, pattern: /^\S+@\S+\.\S+$/ })} type="email" placeholder="you@email.com"
                            className="w-full border border-[#F1DEC9] rounded-xl px-4 py-3 text-[#4A332C] focus:outline-none focus:ring-2 focus:ring-[#4A332C]/20" />
                        {errors.email && <p className="text-red-500 text-xs mt-1">Valid email required</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-[#4A332C] mb-1.5">Password</label>
                        <input {...register('password', { required: true, minLength: 6 })} type="password" placeholder="Min 6 characters"
                            className="w-full border border-[#F1DEC9] rounded-xl px-4 py-3 text-[#4A332C] focus:outline-none focus:ring-2 focus:ring-[#4A332C]/20" />
                        {errors.password && <p className="text-red-500 text-xs mt-1">Password must be at least 6 characters</p>}
                    </div>

                    <button type="submit" disabled={loading}
                        className="w-full bg-[#4A332C] text-white py-3.5 rounded-full font-bold text-base hover:bg-[#2C1A14] transition-colors disabled:opacity-60 mt-2">
                        {loading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Create Account'}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default Login;
