import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { createCustomOrderApi } from '../api/api';
import { Upload, ArrowRight } from 'lucide-react';

const FLAVORS = ['Chocolate', 'Vanilla', 'Red Velvet', 'Strawberry', 'Butterscotch', 'Mango', 'Pineapple', 'Black Forest'];
const SHAPES = ['Round', 'Square', 'Heart', 'Rectangle'];
const FROSTINGS = ['Whipped Cream', 'Buttercream', 'Fondant', 'Naked (No Frosting)'];
const TOPPINGS = ['Fresh Berries', 'Chocolate Drip', 'Sprinkles', 'Macarons', 'Fresh Flowers', 'Oreos', 'Caramel Drizzle'];

const CustomCake = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const [selectedToppings, setSelectedToppings] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

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

    if (success) return (
        <div className="max-w-xl mx-auto px-6 py-20 text-center">
            <div className="text-6xl mb-6">🎉</div>
            <h2 className="text-3xl font-bold text-[#4A332C] mb-4">Request Received!</h2>
            <p className="text-[#4A332C]/70 mb-8">We'll review your custom cake request and get in touch with a quote within 24 hours.</p>
            <button onClick={() => navigate('/')} className="bg-[#4A332C] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#2C1A14]">
                Back to Home
            </button>
        </div>
    );

    return (
        <div className="max-w-2xl mx-auto px-4 py-12">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-bold text-[#4A332C]">Build Your Dream Cake</h1>
                <p className="text-[#C8B6A6] mt-2">Tell us exactly what you want. We'll make it happen.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-7 bg-white p-8 rounded-3xl shadow-[0_8px_40px_rgba(74,51,44,0.08)]">
                {/* Flavor */}
                <div>
                    <label className="block text-sm font-semibold text-[#4A332C] mb-2">Cake Flavor *</label>
                    <select {...register('flavor', { required: true })} className="w-full border border-[#F1DEC9] rounded-xl px-4 py-3 text-[#4A332C] focus:outline-none focus:ring-2 focus:ring-[#4A332C]/20">
                        {FLAVORS.map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                </div>

                {/* Size & Shape */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-[#4A332C] mb-2">Size *</label>
                        <select {...register('size', { required: true })} className="w-full border border-[#F1DEC9] rounded-xl px-4 py-3 text-[#4A332C] focus:outline-none">
                            {['500g', '1kg', '2kg'].map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-[#4A332C] mb-2">Shape *</label>
                        <select {...register('shape', { required: true })} className="w-full border border-[#F1DEC9] rounded-xl px-4 py-3 text-[#4A332C] focus:outline-none">
                            {SHAPES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                </div>

                {/* Frosting */}
                <div>
                    <label className="block text-sm font-semibold text-[#4A332C] mb-2">Frosting Style</label>
                    <select {...register('frosting')} className="w-full border border-[#F1DEC9] rounded-xl px-4 py-3 text-[#4A332C] focus:outline-none">
                        {FROSTINGS.map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                </div>

                {/* Toppings */}
                <div>
                    <label className="block text-sm font-semibold text-[#4A332C] mb-3">Toppings</label>
                    <div className="flex flex-wrap gap-2">
                        {TOPPINGS.map(t => (
                            <button
                                key={t} type="button" onClick={() => toggleTopping(t)}
                                className={`px-4 py-2 rounded-full text-sm font-medium border-2 transition-all ${selectedToppings.includes(t)
                                        ? 'border-[#4A332C] bg-[#4A332C] text-white'
                                        : 'border-[#F1DEC9] text-[#4A332C] hover:border-[#4A332C]/40'
                                    }`}
                            >{t}</button>
                        ))}
                    </div>
                </div>

                {/* Message */}
                <div>
                    <label className="block text-sm font-semibold text-[#4A332C] mb-2">Message on Cake</label>
                    <input
                        type="text"
                        {...register('message')}
                        placeholder="e.g. Happy Anniversary! ❤️"
                        maxLength={60}
                        className="w-full border border-[#F1DEC9] rounded-xl px-4 py-3 text-[#4A332C] focus:outline-none focus:ring-2 focus:ring-[#4A332C]/20"
                    />
                </div>

                {/* Delivery Date */}
                <div>
                    <label className="block text-sm font-semibold text-[#4A332C] mb-2">Delivery Date *</label>
                    <input
                        type="date"
                        min={minDate}
                        {...register('deliveryDate', { required: 'Please select a delivery date' })}
                        className="w-full border border-[#F1DEC9] rounded-xl px-4 py-3 text-[#4A332C] focus:outline-none focus:ring-2 focus:ring-[#4A332C]/20"
                    />
                    {errors.deliveryDate && <p className="text-red-500 text-xs mt-1">{errors.deliveryDate.message}</p>}
                </div>

                {/* Special Instructions */}
                <div>
                    <label className="block text-sm font-semibold text-[#4A332C] mb-2">Special Instructions</label>
                    <textarea
                        {...register('specialInstructions')}
                        rows={3}
                        placeholder="Any additional notes — allergies, color preferences, design inspiration..."
                        className="w-full border border-[#F1DEC9] rounded-xl px-4 py-3 text-[#4A332C] focus:outline-none focus:ring-2 focus:ring-[#4A332C]/20 resize-none"
                    />
                </div>

                <button
                    type="submit"
                    disabled={submitting}
                    className="w-full flex items-center justify-center gap-2 bg-[#4A332C] text-white py-4 rounded-full text-base font-bold hover:bg-[#2C1A14] transition-all disabled:opacity-60"
                >
                    {submitting ? 'Submitting...' : (<>Submit Custom Order <ArrowRight className="w-4 h-4" /></>)}
                </button>

                {!user && (
                    <p className="text-center text-sm text-[#C8B6A6]">
                        <span onClick={() => navigate('/login')} className="font-semibold text-[#4A332C] cursor-pointer underline">Login</span> to submit your custom cake order.
                    </p>
                )}
            </form>
        </div>
    );
};

export default CustomCake;
