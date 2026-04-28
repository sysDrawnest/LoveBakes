import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import heroImage from '../assets/login background.png';
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight } from 'lucide-react';

const Login = ({ initialMode = 'login' }) => {
    const { login, register: registerUser } = useAuth();
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const [mode, setMode] = useState(initialMode);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const switchMode = (m) => { setMode(m); setError(''); reset(); };

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
        } finally { setLoading(false); }
    };

    const Field = ({ icon: Icon, label, error: fieldError, optional, children }) => (
        <div style={{ marginBottom: 18 }}>
            <label style={{
                display: 'block',
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: '#A07060',
                marginBottom: 8,
                fontFamily: "'DM Sans', sans-serif",
            }}>
                {label}
                {optional && <span style={{ color: '#C9A27E', fontWeight: 400, textTransform: 'none', letterSpacing: 0, fontSize: 11 }}> (optional)</span>}
            </label>
            <div className="input-field-relative">
                <Icon size={16} color={fieldError ? '#E85D75' : '#C9A27E'} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', zIndex: 1 }} />
                {children}
            </div>
            <AnimatePresence>
                {fieldError && (
                    <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        style={{ color: '#E85D75', fontSize: 11, marginTop: 6, fontFamily: "'DM Sans', sans-serif" }}>
                        {fieldError}
                    </motion.p>
                )}
            </AnimatePresence>
        </div>
    );

    return (
        <div style={{
            minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative', overflow: 'hidden', fontFamily: "'DM Sans', sans-serif",
        }}>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        input:focus { border-color: #D4785A !important; box-shadow: 0 0 0 3px rgba(212,120,90,0.13) !important; background: rgba(255,255,255,0.98) !important; }
        * { box-sizing: border-box; }
      `}</style>

            {/* Full-page background image */}
            <img
                src={heroImage}
                alt=""
                style={{
                    position: 'fixed', inset: 0, width: '100%', height: '100%',
                    objectFit: 'cover', objectPosition: 'center',
                    zIndex: 0,
                }}
            />

            {/* Very subtle vignette so edges don't distract */}
            <div style={{
                position: 'fixed', inset: 0, zIndex: 1,
                background: 'radial-gradient(ellipse at center, transparent 35%, rgba(240,220,205,0.18) 100%)',
                pointerEvents: 'none',
            }} />

            {/* ── The Card — sits over the natural blank rectangle in the illustration ── */}
            <motion.div
                initial={{ opacity: 0, y: 28, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                style={{
                    position: 'relative', zIndex: 2,
                    width: '100%', maxWidth: 420,
                    background: 'rgba(255, 251, 248, 0.82)',
                    backdropFilter: 'blur(22px) saturate(1.4)',
                    WebkitBackdropFilter: 'blur(22px) saturate(1.4)',
                    borderRadius: 32,
                    boxShadow: '0 8px 48px rgba(160,100,70,0.13), 0 2px 12px rgba(160,100,70,0.08), inset 0 1px 0 rgba(255,255,255,0.9)',
                    border: '1px solid rgba(255,235,220,0.7)',
                    padding: '36px 34px 32px',
                    margin: '20px',
                }}
            >
                {/* Logo & heading */}
                <div style={{ textAlign: 'center', marginBottom: 28 }}>
                    <motion.div
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                        style={{ fontSize: 42, display: 'inline-block', marginBottom: 8 }}
                    >🎂</motion.div>
                    <h1 style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: 30, fontWeight: 700, color: '#3B2A25',
                        margin: '0 0 6px', letterSpacing: '-0.01em',
                    }}>
                        LoveBakes
                    </h1>
                    <AnimatePresence mode="wait">
                        <motion.p
                            key={mode}
                            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                            style={{ fontSize: 13.5, color: '#B08070', margin: 0, fontStyle: 'italic' }}
                        >
                            {mode === 'login' ? 'Welcome back, sweet tooth 🍰' : 'Create your account & indulge'}
                        </motion.p>
                    </AnimatePresence>
                </div>

                {/* Tab Toggle */}
                <div style={{
                    display: 'flex', background: 'rgba(201,162,126,0.18)',
                    borderRadius: 50, padding: 4, marginBottom: 26, position: 'relative',
                }}>
                    {[['login', 'Login'], ['register', 'Sign Up']].map(([m, label]) => (
                        <button key={m} onClick={() => switchMode(m)} style={{
                            flex: 1, position: 'relative', zIndex: 1,
                            padding: '12px 0', background: 'none', border: 'none',
                            borderRadius: 50, fontSize: 13, fontWeight: 700,
                            cursor: 'pointer', color: mode === m ? 'white' : '#A07060',
                            transition: 'color 0.25s', fontFamily: "'DM Sans', sans-serif",
                        }}>
                            {mode === m && (
                                <motion.div
                                    layoutId="tab-bg"
                                    style={{
                                        position: 'absolute', inset: 0, borderRadius: 50,
                                        background: 'linear-gradient(135deg, #E8866A, #D4605A)',
                                        boxShadow: '0 3px 14px rgba(212,96,90,0.38)', zIndex: -1,
                                    }}
                                    transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                                />
                            )}
                            {label}
                        </button>
                    ))}
                </div>

                {/* Error */}
                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                            animate={{ opacity: 1, height: 'auto', marginBottom: 18 }}
                            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                            style={{ background: '#FFF0EE', border: '1px solid #FCCACA', borderRadius: 12, padding: '12px 15px', fontSize: 13, color: '#C0392B' }}
                        >
                            ⚠️ {error}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)}>
                    <AnimatePresence>
                        {mode === 'register' && (
                            <motion.div
                                key="extra"
                                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden' }}
                            >
                                <Field icon={User} label="Full Name" error={errors.name && 'Name is required'}>
                                    <input {...register('name', { required: mode === 'register' })} placeholder="Your full name" className={`auth-input ${errors.name ? 'has-error' : ''}`} />
                                </Field>
                                <Field icon={Phone} label="Phone" optional>
                                    <input {...register('phone')} placeholder="+91 XXXXX XXXXX" className="auth-input" />
                                </Field>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <Field icon={Mail} label="Email" error={errors.email && 'Valid email required'}>
                        <input
                            {...register('email', { required: true, pattern: /^\S+@\S+\.\S+$/ })}
                            type="email"
                            placeholder="you@email.com"
                            className={`auth-input ${errors.email ? 'has-error' : ''}`}
                        />
                    </Field>

                    <Field icon={Lock} label="Password" error={errors.password && 'Minimum 6 characters'}>
                        <input
                            {...register('password', { required: true, minLength: 6 })}
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Min. 6 characters"
                            className={`auth-input has-button ${errors.password ? 'has-error' : ''}`}
                        />
                        <button type="button" onClick={() => setShowPassword(v => !v)} style={{
                            position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                            background: 'none', border: 'none', cursor: 'pointer', padding: 4, zIndex: 2,
                        }}>
                            {showPassword ? <EyeOff size={16} color="#C9A27E" /> : <Eye size={16} color="#C9A27E" />}
                        </button>
                    </Field>

                    {mode === 'login' && (
                        <div style={{ textAlign: 'right', marginTop: -10, marginBottom: 18 }}>
                            <span style={{ fontSize: 12, color: '#D4705A', fontWeight: 600, cursor: 'pointer' }}>
                                Forgot password?
                            </span>
                        </div>
                    )}

                    {/* Submit */}
                    <motion.button
                        type="submit" disabled={loading}
                        whileHover={!loading ? { scale: 1.02, y: -2 } : {}}
                        whileTap={!loading ? { scale: 0.97 } : {}}
                        style={{
                            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                            padding: '16px', borderRadius: 14, border: 'none',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            background: loading
                                ? 'rgba(212,120,90,0.45)'
                                : 'linear-gradient(135deg, #E8866A 0%, #D4605A 100%)',
                            color: 'white', fontSize: 14.5, fontWeight: 700,
                            fontFamily: "'DM Sans', sans-serif",
                            boxShadow: loading ? 'none' : '0 6px 24px rgba(212,96,90,0.38)',
                            transition: 'all 0.2s', marginTop: 8,
                            letterSpacing: '0.01em',
                        }}
                    >
                        {loading
                            ? <motion.span animate={{ opacity: [1, 0.5, 1] }} transition={{ repeat: Infinity, duration: 1 }}>
                                Please wait...
                            </motion.span>
                            : <>{mode === 'login' ? 'Login to LoveBakes' : 'Create My Account'} <ArrowRight size={16} /></>
                        }
                    </motion.button>
                </form>

                {/* Divider */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '22px 0' }}>
                    <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, transparent, #E8CABB)' }} />
                    <span style={{ fontSize: 11, color: '#C9A27E', fontWeight: 600, letterSpacing: '0.12em' }}>OR</span>
                    <div style={{ flex: 1, height: 1, background: 'linear-gradient(270deg, transparent, #E8CABB)' }} />
                </div>

                {/* Google */}
                <button
                    style={{
                        width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                        padding: '14px', borderRadius: 14,
                        border: '1.5px solid rgba(200,170,150,0.5)',
                        background: 'rgba(255,252,250,0.7)',
                        backdropFilter: 'blur(8px)',
                        cursor: 'pointer', fontSize: 13.5, fontWeight: 600,
                        color: '#3B2A25', fontFamily: "'DM Sans', sans-serif",
                        transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#D4705A'; e.currentTarget.style.background = 'rgba(255,252,250,0.95)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(200,170,150,0.5)'; e.currentTarget.style.background = 'rgba(255,252,250,0.7)'; }}
                >
                    <svg width="18" height="18" viewBox="0 0 18 18">
                        <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4" />
                        <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853" />
                        <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05" />
                        <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z" fill="#EA4335" />
                    </svg>
                    Continue with Google
                </button>

                {/* Switch mode */}
                <p style={{ textAlign: 'center', marginTop: 22, marginBottom: 0, fontSize: 13, color: '#B08878' }}>
                    {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                    <span
                        onClick={() => switchMode(mode === 'login' ? 'register' : 'login')}
                        style={{ color: '#D4605A', fontWeight: 700, cursor: 'pointer' }}
                    >
                        {mode === 'login' ? 'Sign Up' : 'Login'}
                    </span>
                </p>
            </motion.div>
        </div>
    );
};

export default Login;