import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { createOrderApi } from '../api/api';
import { motion } from 'framer-motion';

const STEPS = ['Delivery Details', 'Payment', 'Review'];
const TIMES = ['10:00 AM – 12:00 PM', '12:00 PM – 2:00 PM', '2:00 PM – 5:00 PM', '5:00 PM – 8:00 PM'];

const Checkout = () => {
    const { user } = useAuth();
    const { cartItems, cartTotal, clearCart } = useCart();
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors }, getValues } = useForm();

    const [step, setStep] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [placing, setPlacing] = useState(false);

    if (!user) { navigate('/login'); return null; }
    if (cartItems.length === 0) { navigate('/cart'); return null; }

    const DELIVERY_FEE = 50;
    const total = cartTotal + DELIVERY_FEE;
    const minDateStr = (() => { const d = new Date(); d.setDate(d.getDate() + 1); return d.toISOString().split('T')[0]; })();

    const placeOrder = async (data) => {
        setPlacing(true);
        try {
            const { data: order } = await createOrderApi({
                items: cartItems.map(i => ({
                    product: i._id,
                    name: i.name,
                    size: i.size,
                    quantity: i.quantity,
                    price: i.price,
                    message: i.message || '',
                })),
                deliveryAddress: {
                    name: data.name,
                    phone: data.phone,
                    street: data.street,
                    city: data.city,
                    state: data.state,
                    zip: data.zip,
                },
                deliveryDate: data.deliveryDate,
                deliveryTime: data.deliveryTime,
                paymentMethod,
                totalPrice: total,
            });
            clearCart();
            navigate('/order-confirmation', { state: { order } });
        } catch (e) {
            alert(e.response?.data?.message || 'Failed to place order. Try again.');
        } finally { setPlacing(false); }
    };

    return (
        <div className="max-w-2xl mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold text-[#4A332C] mb-8 text-center">Checkout</h1>

            {/* Step Indicator */}
            <div className="flex items-center justify-center mb-10 gap-3">
                {STEPS.map((s, i) => (
                    <div key={i} className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${i <= step ? 'bg-[#4A332C] text-white' : 'bg-[#F1DEC9] text-[#C8B6A6]'
                            }`}>{i + 1}</div>
                        {i < STEPS.length - 1 && <div className={`w-12 h-0.5 ${i < step ? 'bg-[#4A332C]' : 'bg-[#F1DEC9]'}`} />}
                    </div>
                ))}
            </div>

            <form onSubmit={handleSubmit(placeOrder)}>
                {/* Step 0: Delivery Details */}
                {step === 0 && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-7 rounded-3xl shadow-[0_8px_40px_rgba(74,51,44,0.08)] space-y-5">
                        <h2 className="text-xl font-bold text-[#4A332C]">Delivery Details</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <label className="label">Full Name *</label>
                                <input {...register('name', { required: 'Required' })} defaultValue={user.name} className="inp" placeholder="Your name" />
                                {errors.name && <p className="err">{errors.name.message}</p>}
                            </div>
                            <div className="col-span-2">
                                <label className="label">Phone *</label>
                                <input {...register('phone', { required: 'Required' })} defaultValue={user.phone} className="inp" placeholder="+91 XXXXX XXXXX" />
                            </div>
                            <div className="col-span-2">
                                <label className="label">Street Address *</label>
                                <input {...register('street', { required: 'Required' })} className="inp" placeholder="Flat / House No., Street" />
                                {errors.street && <p className="err">{errors.street.message}</p>}
                            </div>
                            <div>
                                <label className="label">City *</label>
                                <input {...register('city', { required: true })} className="inp" placeholder="City" />
                            </div>
                            <div>
                                <label className="label">State</label>
                                <input {...register('state')} defaultValue="Odisha" className="inp" />
                            </div>
                            <div>
                                <label className="label">Pincode</label>
                                <input {...register('zip')} className="inp" placeholder="XXXXXX" />
                            </div>
                            <div>
                                <label className="label">Delivery Date *</label>
                                <input type="date" min={minDateStr} {...register('deliveryDate', { required: true })} className="inp" />
                            </div>
                            <div className="col-span-2">
                                <label className="label">Delivery Time Slot</label>
                                <select {...register('deliveryTime')} className="inp">
                                    {TIMES.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>
                        </div>
                        <button type="button" onClick={() => setStep(1)} className="w-full bg-[#4A332C] text-white py-3.5 rounded-full font-bold hover:bg-[#2C1A14]">Next</button>
                    </motion.div>
                )}

                {/* Step 1: Payment */}
                {step === 1 && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-7 rounded-3xl shadow-[0_8px_40px_rgba(74,51,44,0.08)] space-y-5">
                        <h2 className="text-xl font-bold text-[#4A332C]">Payment Method</h2>
                        {[
                            { id: 'cod', label: 'Cash on Delivery', icon: '💵', desc: 'Pay when your order arrives' },
                            { id: 'online', label: 'Online Payment', icon: '💳', desc: 'UPI, card, net banking (coming soon)' },
                        ].map(p => (
                            <button key={p.id} type="button" onClick={() => setPaymentMethod(p.id)}
                                className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${paymentMethod === p.id ? 'border-[#4A332C] bg-[#FFFDF9]' : 'border-[#F1DEC9]'}`}>
                                <span className="text-3xl">{p.icon}</span>
                                <div>
                                    <p className="font-bold text-[#4A332C]">{p.label}</p>
                                    <p className="text-sm text-[#C8B6A6]">{p.desc}</p>
                                </div>
                                <div className={`ml-auto w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === p.id ? 'border-[#4A332C]' : 'border-[#C8B6A6]'}`}>
                                    {paymentMethod === p.id && <div className="w-2.5 h-2.5 rounded-full bg-[#4A332C]" />}
                                </div>
                            </button>
                        ))}
                        <div className="flex gap-3">
                            <button type="button" onClick={() => setStep(0)} className="flex-1 border-2 border-[#F1DEC9] text-[#4A332C] py-3.5 rounded-full font-bold hover:border-[#4A332C]/40">Back</button>
                            <button type="button" onClick={() => setStep(2)} className="flex-1 bg-[#4A332C] text-white py-3.5 rounded-full font-bold hover:bg-[#2C1A14]">Review Order</button>
                        </div>
                    </motion.div>
                )}

                {/* Step 2: Review */}
                {step === 2 && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-7 rounded-3xl shadow-[0_8px_40px_rgba(74,51,44,0.08)] space-y-5">
                        <h2 className="text-xl font-bold text-[#4A332C]">Review Your Order</h2>
                        <div className="space-y-3">
                            {cartItems.map(i => (
                                <div key={i.key} className="flex justify-between text-sm text-[#4A332C]">
                                    <span>{i.name} ({i.size}) × {i.quantity}</span>
                                    <span>₹{i.price * i.quantity}</span>
                                </div>
                            ))}
                        </div>
                        <div className="border-t border-[#F1DEC9] pt-3 space-y-2 text-sm">
                            <div className="flex justify-between text-[#4A332C]/70"><span>Delivery Fee</span><span>₹{DELIVERY_FEE}</span></div>
                            <div className="flex justify-between font-bold text-base text-[#4A332C]"><span>Total</span><span>₹{total}</span></div>
                            <div className="flex justify-between text-[#4A332C]/70"><span>Payment</span><span className="capitalize">{paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online'}</span></div>
                        </div>
                        <div className="flex gap-3">
                            <button type="button" onClick={() => setStep(1)} className="flex-1 border-2 border-[#F1DEC9] text-[#4A332C] py-3.5 rounded-full font-bold hover:border-[#4A332C]/40">Back</button>
                            <button type="submit" disabled={placing} className="flex-1 bg-[#4A332C] text-white py-3.5 rounded-full font-bold hover:bg-[#2C1A14] disabled:opacity-60">
                                {placing ? 'Placing...' : '🎂 Place Order'}
                            </button>
                        </div>
                    </motion.div>
                )}
            </form>

            <style>{`
        .label { display:block; font-size:.8rem; font-weight:600; color:#4A332C; margin-bottom:.35rem; }
        .inp { width:100%; border:1.5px solid #F1DEC9; border-radius:.75rem; padding:.75rem 1rem; color:#4A332C; outline:none; font-size:.9rem; }
        .inp:focus { border-color:#4A332C80; }
        .err { color:red; font-size:.75rem; margin-top:.25rem; }
      `}</style>
        </div>
    );
};

export default Checkout;
