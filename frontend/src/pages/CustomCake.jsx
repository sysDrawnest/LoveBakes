import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { createCustomOrderApi } from '../api/api';
import { ArrowRight, Sparkles, Check } from 'lucide-react';

const FLAVORS = ['Chocolate', 'Vanilla', 'Red Velvet', 'Strawberry', 'Butterscotch', 'Mango', 'Pineapple', 'Black Forest'];
const SHAPES = ['Round', 'Square', 'Heart', 'Rectangle'];
const FROSTINGS = ['Whipped Cream', 'Buttercream', 'Fondant', 'Naked (No Frosting)'];
const TOPPINGS = ['Fresh Berries', 'Chocolate Drip', 'Sprinkles', 'Macarons', 'Fresh Flowers', 'Oreos', 'Caramel Drizzle'];
const SIZES = ['500g', '1kg', '2kg'];

const FLAVOR_COLORS = {
    'Chocolate': '#5C3317',
    'Vanilla': '#F5DEB3',
    'Red Velvet': '#8B0000',
    'Strawberry': '#FF6B8A',
    'Butterscotch': '#D2691E',
    'Mango': '#FF8C00',
    'Pineapple': '#FFD700',
    'Black Forest': '#1a1a2e',
};

const FLAVOR_EMOJIS = {
    'Chocolate': '🍫', 'Vanilla': '🤍', 'Red Velvet': '🌹', 'Strawberry': '🍓',
    'Butterscotch': '🧈', 'Mango': '🥭', 'Pineapple': '🍍', 'Black Forest': '🫐'
};

const SHAPE_ICONS = { 'Round': '⬤', 'Square': '■', 'Heart': '♥', 'Rectangle': '▬' };

const SectionLabel = ({ number, children }) => (
    <div className="flex items-center gap-3 mb-5">
        <div style={{
            width: 28, height: 28, borderRadius: '50%',
            background: 'linear-gradient(135deg, #E85D75, #C9416B)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 11, fontWeight: 700, color: 'white', flexShrink: 0,
            fontFamily: "'Playfair Display', serif",
            boxShadow: '0 2px 12px rgba(232,93,117,0.35)'
        }}>{number}</div>
        <span style={{
            fontSize: 11, fontWeight: 700, letterSpacing: '0.2em',
            textTransform: 'uppercase', color: '#9B7560'
        }}>{children}</span>
        <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, #E8C9B8, transparent)' }} />
    </div>
);

const CustomCake = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { register, handleSubmit, watch, formState: { errors } } = useForm({ defaultValues: { flavor: 'Chocolate', size: '1kg', shape: 'Round', frosting: 'Buttercream' } });
    const [selectedToppings, setSelectedToppings] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const selectedFlavor = watch('flavor');

    const toggleTopping = (t) => setSelectedToppings(prev =>
        prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]
    );

    const today = new Date();
    today.setDate(today.getDate() + 2);
    const minDate = today.toISOString().split('T')[0];

    const onSubmit = async (data) => {
        if (!user) { navigate('/login'); return; }
        setSubmitting(true);
        try {
            await createCustomOrderApi({ ...data, toppings: selectedToppings });
            setSuccess(true);
        } catch (e) {
            alert(e.response?.data?.message || 'Failed to submit. Please try again.');
        } finally { setSubmitting(false); }
    };

    const inputStyle = {
        width: '100%', border: '1.5px solid #E8D5C8', borderRadius: 14,
        padding: '14px 18px', color: '#3B2A25', fontSize: 14,
        fontFamily: "'DM Sans', sans-serif", background: '#FFFAF8',
        outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s',
        boxSizing: 'border-box',
    };

    if (success) return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
                minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'linear-gradient(145deg, #FFF5F0 0%, #FFF0F3 50%, #FFF8F0 100%)',
                padding: '40px 20px'
            }}
        >
            <div style={{ textAlign: 'center', maxWidth: 480 }}>
                <motion.div
                    animate={{ rotate: [0, -10, 10, -5, 5, 0], scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.8 }}
                    style={{ fontSize: 80, marginBottom: 24, display: 'block' }}
                >🎂</motion.div>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 38, color: '#3B2A25', marginBottom: 12, lineHeight: 1.2 }}>
                    Your Dream Cake<br />is on its way!
                </h2>
                <p style={{ color: '#9B7560', fontSize: 16, lineHeight: 1.7, marginBottom: 32, fontFamily: "'DM Sans', sans-serif" }}>
                    We've received your custom order. Our pastry team will review your creation and reach out with a quote within 24 hours.
                </p>
                <motion.button
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => navigate('/')}
                    style={{
                        background: 'linear-gradient(135deg, #E85D75, #C9416B)',
                        color: 'white', border: 'none', borderRadius: 50,
                        padding: '16px 40px', fontSize: 15, fontWeight: 700,
                        fontFamily: "'DM Sans', sans-serif", cursor: 'pointer',
                        boxShadow: '0 8px 30px rgba(232,93,117,0.4)'
                    }}
                >Back to Home</motion.button>
            </div>
        </motion.div>
    );

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(160deg, #FFF5EF 0%, #FFF0F4 40%, #FFFAEF 100%)',
            fontFamily: "'DM Sans', sans-serif",
            padding: '0 0 80px',
        }}>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        input[type="date"]::-webkit-calendar-picker-indicator { opacity: 0.5; cursor: pointer; }
        select { appearance: none; -webkit-appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%239B7560' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 16px center; padding-right: 40px !important; }
        input:focus, select:focus, textarea:focus { border-color: #E85D75 !important; box-shadow: 0 0 0 4px rgba(232,93,117,0.1) !important; }
        textarea { resize: none; }
        * { box-sizing: border-box; }
      `}</style>

            {/* Hero Header */}
            <div style={{
                background: 'linear-gradient(135deg, #2A1A16 0%, #3B2A25 60%, #1a0f0c 100%)',
                padding: '60px 20px 80px',
                position: 'relative', overflow: 'hidden',
                marginBottom: -40,
            }}>
                {/* Decorative circles */}
                {[...Array(5)].map((_, i) => (
                    <div key={i} style={{
                        position: 'absolute',
                        width: [300, 200, 150, 100, 80][i],
                        height: [300, 200, 150, 100, 80][i],
                        borderRadius: '50%',
                        border: '1px solid rgba(232,93,117,0.15)',
                        top: ['-100px', '20px', '-50px', '80px', '30px'][i],
                        right: ['-100px', '-60px', '200px', '-30px', '100px'][i],
                    }} />
                ))}
                <div style={{ maxWidth: 680, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{
                            display: 'inline-flex', alignItems: 'center', gap: 8,
                            background: 'rgba(232,93,117,0.2)', border: '1px solid rgba(232,93,117,0.4)',
                            borderRadius: 50, padding: '6px 18px', marginBottom: 20,
                        }}
                    >
                        <Sparkles size={12} color="#E85D75" />
                        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#E85D75' }}>
                            Bespoke Patisserie
                        </span>
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: 'clamp(32px, 6vw, 52px)',
                            color: '#FFF5EF', lineHeight: 1.15, marginBottom: 16,
                            fontWeight: 600,
                        }}
                    >
                        Design Your<br />
                        <em style={{ color: '#E85D75' }}>Dream Cake</em>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        style={{ color: 'rgba(255,245,239,0.55)', fontSize: 16, lineHeight: 1.7 }}
                    >
                        Every detail crafted to your vision. We'll bring your cake to life.
                    </motion.p>
                </div>
            </div>

            {/* Form */}
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                style={{ maxWidth: 680, margin: '0 auto', padding: '0 20px' }}
            >
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div style={{
                        background: 'white', borderRadius: 28,
                        boxShadow: '0 20px 80px rgba(74,51,44,0.12), 0 4px 20px rgba(74,51,44,0.06)',
                        padding: 'clamp(28px, 5vw, 48px)',
                        border: '1px solid rgba(232,208,196,0.5)',
                    }}>

                        {/* — SECTION 1: FLAVOR — */}
                        <SectionLabel number="1">Choose Your Flavor</SectionLabel>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 32 }}>
                            {FLAVORS.map(f => {
                                const isSelected = selectedFlavor === f;
                                return (
                                    <label key={f} style={{ cursor: 'pointer' }}>
                                        <input type="radio" value={f} {...register('flavor')} style={{ display: 'none' }} />
                                        <motion.div
                                            whileHover={{ scale: 1.04, y: -2 }}
                                            whileTap={{ scale: 0.97 }}
                                            style={{
                                                borderRadius: 16, padding: '12px 8px', textAlign: 'center',
                                                border: isSelected ? '2px solid #E85D75' : '2px solid #F0E0D6',
                                                background: isSelected ? 'linear-gradient(135deg, #FFF0F3, #FFE8EC)' : '#FFFAF8',
                                                transition: 'all 0.2s',
                                                boxShadow: isSelected ? '0 4px 20px rgba(232,93,117,0.2)' : 'none',
                                            }}
                                        >
                                            <div style={{ fontSize: 24, marginBottom: 4 }}>{FLAVOR_EMOJIS[f]}</div>
                                            <div style={{
                                                fontSize: 11, fontWeight: 600, color: isSelected ? '#E85D75' : '#9B7560',
                                                letterSpacing: '0.02em', lineHeight: 1.3
                                            }}>{f}</div>
                                        </motion.div>
                                    </label>
                                );
                            })}
                        </div>

                        {/* — SECTION 2: SIZE — */}
                        <SectionLabel number="2">Select Size</SectionLabel>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 32 }}>
                            {SIZES.map(s => {
                                const sizeWatch = watch('size');
                                const isSelected = sizeWatch === s;
                                const labels = { '500g': 'Petite', '1kg': 'Classic', '2kg': 'Grand' };
                                const serves = { '500g': 'Serves 4–6', '1kg': 'Serves 8–10', '2kg': 'Serves 14–16' };
                                return (
                                    <label key={s} style={{ cursor: 'pointer' }}>
                                        <input type="radio" value={s} {...register('size')} style={{ display: 'none' }} />
                                        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} style={{
                                            borderRadius: 18, padding: '16px 12px', textAlign: 'center',
                                            border: isSelected ? '2px solid #E85D75' : '2px solid #F0E0D6',
                                            background: isSelected ? 'linear-gradient(135deg, #FFF0F3, #FFE8EC)' : '#FFFAF8',
                                            transition: 'all 0.2s',
                                            boxShadow: isSelected ? '0 4px 20px rgba(232,93,117,0.2)' : 'none',
                                        }}>
                                            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: isSelected ? '#E85D75' : '#3B2A25', marginBottom: 2 }}>{s}</div>
                                            <div style={{ fontSize: 11, fontWeight: 700, color: isSelected ? '#E85D75' : '#9B7560', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>{labels[s]}</div>
                                            <div style={{ fontSize: 10, color: '#C9A27E' }}>{serves[s]}</div>
                                        </motion.div>
                                    </label>
                                );
                            })}
                        </div>

                        {/* — SECTION 3: SHAPE & FROSTING — */}
                        <SectionLabel number="3">Shape & Frosting</SectionLabel>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 32 }}>
                            <div>
                                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#9B7560', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Shape</label>
                                <select {...register('shape')} style={inputStyle}>
                                    {SHAPES.map(s => <option key={s} value={s}>{SHAPE_ICONS[s]} {s}</option>)}
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#9B7560', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Frosting</label>
                                <select {...register('frosting')} style={inputStyle}>
                                    {FROSTINGS.map(f => <option key={f} value={f}>{f}</option>)}
                                </select>
                            </div>
                        </div>

                        {/* — SECTION 4: TOPPINGS — */}
                        <SectionLabel number="4">Toppings</SectionLabel>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 32 }}>
                            {TOPPINGS.map(t => {
                                const isSelected = selectedToppings.includes(t);
                                return (
                                    <motion.button
                                        key={t} type="button" onClick={() => toggleTopping(t)}
                                        whileHover={{ scale: 1.05, y: -2 }}
                                        whileTap={{ scale: 0.95 }}
                                        style={{
                                            padding: '10px 18px', borderRadius: 50, fontSize: 13, fontWeight: 600,
                                            border: isSelected ? '2px solid #E85D75' : '2px solid #E8D5C8',
                                            background: isSelected ? 'linear-gradient(135deg, #E85D75, #C9416B)' : 'white',
                                            color: isSelected ? 'white' : '#9B7560',
                                            cursor: 'pointer', transition: 'all 0.2s',
                                            boxShadow: isSelected ? '0 4px 15px rgba(232,93,117,0.35)' : 'none',
                                            display: 'flex', alignItems: 'center', gap: 6,
                                        }}
                                    >
                                        {isSelected && <Check size={12} />}
                                        {t}
                                    </motion.button>
                                );
                            })}
                        </div>

                        {/* — SECTION 5: DETAILS — */}
                        <SectionLabel number="5">Final Details</SectionLabel>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 32 }}>
                            <div>
                                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#9B7560', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Message on Cake</label>
                                <input
                                    type="text"
                                    {...register('message')}
                                    placeholder="e.g. Happy Anniversary! ❤️"
                                    maxLength={60}
                                    style={inputStyle}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#9B7560', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                    Delivery Date <span style={{ color: '#E85D75' }}>*</span>
                                </label>
                                <input
                                    type="date"
                                    min={minDate}
                                    {...register('deliveryDate', { required: 'Please select a delivery date' })}
                                    style={inputStyle}
                                />
                                <AnimatePresence>
                                    {errors.deliveryDate && (
                                        <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                            style={{ color: '#E85D75', fontSize: 12, marginTop: 6 }}>
                                            {errors.deliveryDate.message}
                                        </motion.p>
                                    )}
                                </AnimatePresence>
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#9B7560', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Special Instructions</label>
                                <textarea
                                    {...register('specialInstructions')}
                                    rows={4}
                                    placeholder="Allergies, color preferences, design inspiration, references..."
                                    style={{ ...inputStyle, lineHeight: 1.7 }}
                                />
                            </div>
                        </div>

                        {/* Submit */}
                        <motion.button
                            type="submit"
                            disabled={submitting}
                            whileHover={!submitting ? { scale: 1.02, y: -2 } : {}}
                            whileTap={!submitting ? { scale: 0.98 } : {}}
                            style={{
                                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                                background: submitting ? '#D9A0AA' : 'linear-gradient(135deg, #E85D75, #C9416B)',
                                color: 'white', border: 'none', borderRadius: 18,
                                padding: '20px 32px', fontSize: 16, fontWeight: 700,
                                fontFamily: "'DM Sans', sans-serif", cursor: submitting ? 'not-allowed' : 'pointer',
                                boxShadow: submitting ? 'none' : '0 8px 40px rgba(232,93,117,0.45)',
                                transition: 'all 0.2s', letterSpacing: '0.02em',
                            }}
                        >
                            {submitting ? (
                                <>
                                    <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                                        style={{ display: 'inline-block' }}>🎂</motion.span>
                                    Placing your order...
                                </>
                            ) : (
                                <>
                                    Submit Custom Order
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </motion.button>

                        {!user && (
                            <p style={{ textAlign: 'center', fontSize: 13, color: '#C9A27E', marginTop: 16 }}>
                                <span onClick={() => navigate('/login')}
                                    style={{ fontWeight: 700, color: '#E85D75', cursor: 'pointer', textDecoration: 'underline' }}>
                                    Login
                                </span>{' '}to submit your custom cake order.
                            </p>
                        )}
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default CustomCake;