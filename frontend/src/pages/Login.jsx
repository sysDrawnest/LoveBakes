// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useForm } from 'react-hook-form';
// import { motion, AnimatePresence } from 'framer-motion';
// import { useAuth } from '../context/AuthContext';
// import heroImage from '../assets/login background.png';
// import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight, Sparkles } from 'lucide-react';

// const FloatingInput = ({ icon: Icon, label, error, optional, children }) => (
//     <div style={{ marginBottom: 18 }}>
//         <label style={{
//             display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '0.15em',
//             textTransform: 'uppercase', color: '#9B7560', marginBottom: 8,
//             fontFamily: "'DM Sans', sans-serif",
//         }}>
//             {label}{' '}
//             {optional && <span style={{ color: '#C9A27E', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(optional)</span>}
//         </label>
//         {children}
//         <AnimatePresence>
//             {error && (
//                 <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
//                     style={{ color: '#E85D75', fontSize: 11, marginTop: 5, fontFamily: "'DM Sans', sans-serif" }}>
//                     {error}
//                 </motion.p>
//             )}
//         </AnimatePresence>
//     </div>
// );

// const Login = () => {
//     const { login, register: registerUser } = useAuth();
//     const navigate = useNavigate();
//     const { register, handleSubmit, formState: { errors }, reset } = useForm();
//     const [mode, setMode] = useState('login');
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState('');
//     const [showPassword, setShowPassword] = useState(false);

//     const switchMode = (m) => { setMode(m); setError(''); reset(); };

//     const onSubmit = async (data) => {
//         setLoading(true);
//         setError('');
//         try {
//             if (mode === 'login') {
//                 await login(data.email, data.password);
//             } else {
//                 await registerUser(data.name, data.email, data.password, data.phone);
//             }
//             navigate('/');
//         } catch (e) {
//             setError(e.response?.data?.message || 'Something went wrong. Please try again.');
//         } finally { setLoading(false); }
//     };

//     const inputBase = (hasError) => ({
//         width: '100%', paddingLeft: 44, paddingRight: 16, paddingTop: 14, paddingBottom: 14,
//         border: `1.5px solid ${hasError ? '#E85D75' : '#EDD8CC'}`,
//         borderRadius: 14, fontSize: 14, color: '#3B2A25',
//         fontFamily: "'DM Sans', sans-serif",
//         background: 'rgba(255,250,248,0.8)',
//         outline: 'none', transition: 'all 0.2s', boxSizing: 'border-box',
//     });

//     return (
//         <div style={{ minHeight: '100vh', display: 'flex', fontFamily: "'DM Sans', sans-serif" }}>
//             <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500;600;700&display=swap');
//         input:focus { border-color: #E85D75 !important; box-shadow: 0 0 0 4px rgba(232,93,117,0.12) !important; background: white !important; }
//         * { box-sizing: border-box; }
//         @media (max-width: 860px) { .hero-panel { display: none !important; } }
//       `}</style>

//             {/* ── LEFT: Hero Image ── */}
//             <div className="hero-panel" style={{ flex: '0 0 52%', position: 'relative', overflow: 'hidden' }}>
//                 <img src={heroImage} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
//                 {/* Overlay */}
//                 <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg, rgba(26,14,11,0.5) 0%, rgba(59,42,37,0.25) 50%, rgba(26,14,11,0.72) 100%)' }} />
//                 {/* Decorative rings */}
//                 {[320, 220, 140].map((sz, i) => (
//                     <div key={i} style={{
//                         position: 'absolute', bottom: -sz * 0.35, right: -sz * 0.28,
//                         width: sz, height: sz, borderRadius: '50%',
//                         border: '1px solid rgba(232,93,117,0.18)', pointerEvents: 'none',
//                     }} />
//                 ))}
//                 {/* Copy */}
//                 <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: 48 }}>
//                     <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.8 }}>
//                         <div style={{
//                             display: 'inline-flex', alignItems: 'center', gap: 8,
//                             background: 'rgba(232,93,117,0.2)', border: '1px solid rgba(232,93,117,0.4)',
//                             borderRadius: 50, padding: '6px 16px', marginBottom: 20,
//                         }}>
//                             <Sparkles size={11} color="#E85D75" />
//                             <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#E85D75' }}>Artisan Patisserie</span>
//                         </div>
//                         <h2 style={{
//                             fontFamily: "'Playfair Display', serif",
//                             fontSize: 'clamp(26px, 3vw, 42px)', color: '#FFF5EF',
//                             lineHeight: 1.2, marginBottom: 16, fontWeight: 600,
//                         }}>
//                             Every Cake Tells<br /><em style={{ color: '#E85D75' }}>Your Story</em>
//                         </h2>
//                         <p style={{ color: 'rgba(255,245,239,0.58)', fontSize: 14, lineHeight: 1.8, maxWidth: 320 }}>
//                             Handcrafted with love, delivered to your door. Celebrate life's sweetest moments with us.
//                         </p>
//                         {/* Testimonial card */}
//                         <div style={{
//                             marginTop: 32, background: 'rgba(255,245,239,0.09)', backdropFilter: 'blur(14px)',
//                             borderRadius: 18, padding: '20px 22px', border: '1px solid rgba(255,245,239,0.14)',
//                         }}>
//                             <div style={{ display: 'flex', gap: 2, marginBottom: 10 }}>
//                                 {[...Array(5)].map((_, i) => <span key={i} style={{ color: '#F59E0B', fontSize: 13 }}>★</span>)}
//                             </div>
//                             <p style={{ color: 'rgba(255,245,239,0.8)', fontSize: 13, lineHeight: 1.75, margin: '0 0 14px', fontStyle: 'italic' }}>
//                                 "The most beautiful cake I've ever seen — and it tasted even better than it looked!"
//                             </p>
//                             <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
//                                 <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #E85D75, #C9416B)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: 'white', fontFamily: "'Playfair Display', serif" }}>P</div>
//                                 <span style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,245,239,0.65)' }}>Priya S. — Mumbai</span>
//                             </div>
//                         </div>
//                     </motion.div>
//                 </div>
//             </div>

//             {/* ── RIGHT: Form ── */}
//             <div style={{
//                 flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
//                 background: 'linear-gradient(160deg, #FFF7F2 0%, #FFF0F4 60%, #FFFAF0 100%)',
//                 padding: '40px 24px', position: 'relative', overflow: 'hidden',
//             }}>
//                 {/* Ambient blobs */}
//                 <div style={{ position: 'absolute', top: -100, right: -80, width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(232,93,117,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />
//                 <div style={{ position: 'absolute', bottom: -80, left: -60, width: 240, height: 240, borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,162,126,0.09) 0%, transparent 70%)', pointerEvents: 'none' }} />

//                 <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
//                     style={{ width: '100%', maxWidth: 420, position: 'relative', zIndex: 1 }}>

//                     {/* Logo */}
//                     <div style={{ textAlign: 'center', marginBottom: 28 }}>
//                         <motion.span animate={{ rotate: [0, -5, 5, 0] }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 4 }}
//                             style={{ fontSize: 42, display: 'inline-block', marginBottom: 10 }}>🎂</motion.span>
//                         <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: '#3B2A25', margin: '0 0 6px', fontWeight: 700 }}>LoveBakes</h1>
//                         <p style={{ fontSize: 13, color: '#C9A27E', margin: 0 }}>
//                             {mode === 'login' ? 'Welcome back, sweet tooth 🍰' : 'Join us & taste the difference'}
//                         </p>
//                     </div>

//                     {/* Toggle */}
//                     <div style={{ display: 'flex', background: 'rgba(201,162,126,0.15)', borderRadius: 50, padding: 4, marginBottom: 24, position: 'relative' }}>
//                         {[['login', 'Login'], ['register', 'Sign Up']].map(([m, label]) => (
//                             <button key={m} onClick={() => switchMode(m)} style={{
//                                 flex: 1, position: 'relative', zIndex: 1, padding: '11px 0',
//                                 background: 'none', border: 'none', borderRadius: 50,
//                                 fontSize: 13, fontWeight: 700, cursor: 'pointer',
//                                 color: mode === m ? 'white' : '#9B7560',
//                                 transition: 'color 0.3s', fontFamily: "'DM Sans', sans-serif",
//                             }}>
//                                 {mode === m && (
//                                     <motion.div layoutId="pill" style={{
//                                         position: 'absolute', inset: 0, borderRadius: 50,
//                                         background: 'linear-gradient(135deg, #E85D75, #C9416B)',
//                                         boxShadow: '0 4px 16px rgba(232,93,117,0.4)', zIndex: -1,
//                                     }} transition={{ type: 'spring', stiffness: 400, damping: 30 }} />
//                                 )}
//                                 {label}
//                             </button>
//                         ))}
//                     </div>

//                     {/* Card */}
//                     <div style={{
//                         background: 'white', borderRadius: 24,
//                         boxShadow: '0 20px 70px rgba(74,51,44,0.1), 0 4px 20px rgba(74,51,44,0.05)',
//                         padding: '32px 28px', border: '1px solid rgba(232,208,196,0.5)',
//                     }}>
//                         {/* Error banner */}
//                         <AnimatePresence>
//                             {error && (
//                                 <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
//                                     style={{ background: '#FFF5F5', border: '1px solid #FECACA', borderRadius: 12, padding: '11px 14px', marginBottom: 18, fontSize: 13, color: '#DC2626' }}>
//                                     ⚠️ {error}
//                                 </motion.div>
//                             )}
//                         </AnimatePresence>

//                         <form onSubmit={handleSubmit(onSubmit)}>
//                             <AnimatePresence mode="wait">
//                                 {mode === 'register' && (
//                                     <motion.div key="reg" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden' }}>
//                                         <FloatingInput icon={User} label="Full Name" error={errors.name && 'Name is required'}>
//                                             <div style={{ position: 'relative' }}>
//                                                 <User size={15} color={errors.name ? '#E85D75' : '#C9A27E'} style={{ position: 'absolute', left: 15, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
//                                                 <input {...register('name', { required: mode === 'register' })} placeholder="Your full name" style={inputBase(errors.name)} />
//                                             </div>
//                                         </FloatingInput>
//                                         <FloatingInput icon={Phone} label="Phone" optional>
//                                             <div style={{ position: 'relative' }}>
//                                                 <Phone size={15} color="#C9A27E" style={{ position: 'absolute', left: 15, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
//                                                 <input {...register('phone')} placeholder="+91 XXXXX XXXXX" style={inputBase(false)} />
//                                             </div>
//                                         </FloatingInput>
//                                     </motion.div>
//                                 )}
//                             </AnimatePresence>

//                             <FloatingInput icon={Mail} label="Email" error={errors.email && 'Valid email required'}>
//                                 <div style={{ position: 'relative' }}>
//                                     <Mail size={15} color={errors.email ? '#E85D75' : '#C9A27E'} style={{ position: 'absolute', left: 15, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
//                                     <input {...register('email', { required: true, pattern: /^\S+@\S+\.\S+$/ })} type="email" placeholder="you@email.com" style={inputBase(errors.email)} />
//                                 </div>
//                             </FloatingInput>

//                             <FloatingInput icon={Lock} label="Password" error={errors.password && 'Minimum 6 characters'}>
//                                 <div style={{ position: 'relative' }}>
//                                     <Lock size={15} color={errors.password ? '#E85D75' : '#C9A27E'} style={{ position: 'absolute', left: 15, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
//                                     <input
//                                         {...register('password', { required: true, minLength: 6 })}
//                                         type={showPassword ? 'text' : 'password'}
//                                         placeholder="Min. 6 characters"
//                                         style={{ ...inputBase(errors.password), paddingRight: 46 }}
//                                     />
//                                     <button type="button" onClick={() => setShowPassword(v => !v)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
//                                         {showPassword ? <EyeOff size={15} color="#C9A27E" /> : <Eye size={15} color="#C9A27E" />}
//                                     </button>
//                                 </div>
//                             </FloatingInput>

//                             {mode === 'login' && (
//                                 <div style={{ textAlign: 'right', marginTop: -10, marginBottom: 20 }}>
//                                     <span style={{ fontSize: 12, color: '#E85D75', fontWeight: 600, cursor: 'pointer' }}>Forgot password?</span>
//                                 </div>
//                             )}

//                             <motion.button
//                                 type="submit" disabled={loading}
//                                 whileHover={!loading ? { scale: 1.02, y: -2 } : {}}
//                                 whileTap={!loading ? { scale: 0.98 } : {}}
//                                 style={{
//                                     width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
//                                     padding: '16px', borderRadius: 16, border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
//                                     background: loading ? '#D9A0AA' : 'linear-gradient(135deg, #E85D75, #C9416B)',
//                                     color: 'white', fontSize: 15, fontWeight: 700,
//                                     fontFamily: "'DM Sans', sans-serif",
//                                     boxShadow: loading ? 'none' : '0 8px 30px rgba(232,93,117,0.4)',
//                                     transition: 'all 0.2s', marginTop: 4,
//                                 }}
//                             >
//                                 {loading
//                                     ? <motion.span animate={{ opacity: [1, 0.5, 1] }} transition={{ repeat: Infinity, duration: 1 }}>Please wait...</motion.span>
//                                     : <>{mode === 'login' ? 'Login to LoveBakes' : 'Create My Account'}<ArrowRight size={17} /></>
//                                 }
//                             </motion.button>
//                         </form>

//                         {/* Divider */}
//                         <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '22px 0' }}>
//                             <div style={{ flex: 1, height: 1, background: '#F0E0D6' }} />
//                             <span style={{ fontSize: 11, color: '#C9A27E', fontWeight: 600, letterSpacing: '0.1em' }}>OR</span>
//                             <div style={{ flex: 1, height: 1, background: '#F0E0D6' }} />
//                         </div>

//                         {/* Google */}
//                         <button
//                             style={{
//                                 width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
//                                 padding: '13px', borderRadius: 14, border: '1.5px solid #EDD8CC',
//                                 background: '#FFFAF8', cursor: 'pointer', fontSize: 13, fontWeight: 600,
//                                 color: '#3B2A25', fontFamily: "'DM Sans', sans-serif", transition: 'border-color 0.2s',
//                             }}
//                             onMouseEnter={e => e.currentTarget.style.borderColor = '#E85D75'}
//                             onMouseLeave={e => e.currentTarget.style.borderColor = '#EDD8CC'}
//                         >
//                             <svg width="17" height="17" viewBox="0 0 18 18">
//                                 <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4" />
//                                 <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853" />
//                                 <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05" />
//                                 <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z" fill="#EA4335" />
//                             </svg>
//                             Continue with Google
//                         </button>
//                     </div>

//                     {/* Footer */}
//                     <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: '#C9A27E' }}>
//                         {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
//                         <span onClick={() => switchMode(mode === 'login' ? 'register' : 'login')}
//                             style={{ color: '#E85D75', fontWeight: 700, cursor: 'pointer' }}>
//                             {mode === 'login' ? 'Sign Up' : 'Login'}
//                         </span>
//                     </p>
//                 </motion.div>
//             </div>
//         </div>
//     );
// };

// export default Login;
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import heroImage from '../assets/login background.png';
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight } from 'lucide-react';

const Login = () => {
    const { login, register: registerUser } = useAuth();
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const [mode, setMode] = useState('login');
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

    const inp = (hasError) => ({
        width: '100%',
        paddingLeft: 42,
        paddingRight: 46,
        paddingTop: 14,
        paddingBottom: 14,
        border: `1.5px solid ${hasError ? '#E85D75' : '#E8D0C4'}`,
        borderRadius: 12,
        fontSize: 14,
        color: '#3B2A25',
        fontFamily: "'DM Sans', sans-serif",
        background: 'rgba(255,252,250,0.85)',
        outline: 'none',
        transition: 'all 0.2s',
        boxSizing: 'border-box',
        backdropFilter: 'blur(4px)',
    });

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
            <div style={{ position: 'relative' }}>
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
                                    <input {...register('name', { required: mode === 'register' })} placeholder="Your full name" style={inp(errors.name)} />
                                </Field>
                                <Field icon={Phone} label="Phone" optional>
                                    <input {...register('phone')} placeholder="+91 XXXXX XXXXX" style={inp(false)} />
                                </Field>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <Field icon={Mail} label="Email" error={errors.email && 'Valid email required'}>
                        <input
                            {...register('email', { required: true, pattern: /^\S+@\S+\.\S+$/ })}
                            type="email"
                            placeholder="you@email.com"
                            style={inp(errors.email)}
                        />
                    </Field>

                    <Field icon={Lock} label="Password" error={errors.password && 'Minimum 6 characters'}>
                        <div style={{ position: 'relative' }}>
                            <input
                                {...register('password', { required: true, minLength: 6 })}
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Min. 6 characters"
                                style={inp(errors.password)}
                            />
                            <button type="button" onClick={() => setShowPassword(v => !v)} style={{
                                position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                                background: 'none', border: 'none', cursor: 'pointer', padding: 4, zIndex: 1,
                            }}>
                                {showPassword ? <EyeOff size={16} color="#C9A27E" /> : <Eye size={16} color="#C9A27E" />}
                            </button>
                        </div>
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