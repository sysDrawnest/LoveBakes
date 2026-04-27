import { useState, useRef, useCallback } from 'react';
import { useReactToPrint } from 'react-to-print';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, Trash2, Printer, Save, Search, User, Phone, Receipt, CheckCircle } from 'lucide-react';
import { createBillApi } from '../../api/api';
import InvoicePrint from './components/InvoicePrint';

// ─── Bakery Quick-Add Catalog ───────────────────────────────────────────────
const CATALOG = [
    {
        category: 'Cakes', emoji: '🎂', items: [
            { name: 'Chocolate Cake', price: 650 },
            { name: 'Pineapple Cake', price: 550 },
            { name: 'Black Forest Cake', price: 700 },
            { name: 'Butterscotch Cake', price: 580 },
            { name: 'Red Velvet Cake', price: 750 },
            { name: 'Custom Cake', price: 900 },
        ]
    },
    {
        category: 'Pastries', emoji: '🥐', items: [
            { name: 'Chocolate Pastry', price: 80 },
            { name: 'Vanilla Pastry', price: 70 },
            { name: 'Strawberry Pastry', price: 85 },
            { name: 'Butterscotch Pastry', price: 75 },
        ]
    },
    {
        category: 'Breads', emoji: '🍞', items: [
            { name: 'White Bread', price: 45 },
            { name: 'Brown Bread', price: 55 },
            { name: 'Multigrain Bread', price: 65 },
            { name: 'Garlic Bread', price: 80 },
        ]
    },
    {
        category: 'Cookies', emoji: '🍪', items: [
            { name: 'Butter Cookies', price: 120 },
            { name: 'Choco Chip Cookies', price: 140 },
            { name: 'Oats Cookies', price: 100 },
        ]
    },
    {
        category: 'Cupcakes', emoji: '🧁', items: [
            { name: 'Vanilla Cupcake', price: 60 },
            { name: 'Chocolate Cupcake', price: 65 },
            { name: 'Red Velvet Cupcake', price: 70 },
        ]
    },
];

const DEFAULT_GST = 5;

const calcItemTotal = (item) => {
    const base = item.price * item.qty;
    const afterDisc = base * (1 - item.discount / 100);
    const gstAmt = afterDisc * (item.gstRate / 100);
    return +(afterDisc + gstAmt).toFixed(2);
};

let cartIdCounter = 1;

const AdminBilling = () => {
    const [cart, setCart] = useState([]);
    const [search, setSearch] = useState('');
    const [activeCategory, setActiveCategory] = useState('Cakes');
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [globalDiscount, setGlobalDiscount] = useState(0);
    const [gstRate, setGstRate] = useState(DEFAULT_GST);
    const [notes, setNotes] = useState('');
    const [saving, setSaving] = useState(false);
    const [savedBill, setSavedBill] = useState(null);
    const [toast, setToast] = useState('');

    const printRef = useRef();
    const barcodeInputRef = useRef();

    // ─── Derived Totals ──────────────────────────────────────────────────────
    const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
    const itemDiscounts = cart.reduce((s, i) => s + i.price * i.qty * (i.discount / 100), 0);
    const afterItemDisc = subtotal - itemDiscounts;
    const globalDiscAmt = +(afterItemDisc * (globalDiscount / 100)).toFixed(2);
    const taxBase = afterItemDisc - globalDiscAmt;
    const gstAmt = +(taxBase * (gstRate / 100)).toFixed(2);
    const grandTotal = +(taxBase + gstAmt).toFixed(2);
    const totalDiscountAmt = +(itemDiscounts + globalDiscAmt).toFixed(2);

    const billData = {
        customerName, customerPhone, notes,
        items: cart.map(i => ({
            name: i.name, qty: i.qty, price: i.price,
            discount: i.discount, gstRate: i.gstRate,
            total: calcItemTotal(i),
        })),
        subtotal: +subtotal.toFixed(2),
        discountAmt: totalDiscountAmt,
        gstAmt,
        grandTotal,
        gstRate,
        billNumber: savedBill?.billNumber || `PREVIEW`,
        createdAt: savedBill?.createdAt || new Date().toISOString(),
    };

    // ─── Cart Actions ────────────────────────────────────────────────────────
    const addToCart = useCallback((item) => {
        setCart(prev => {
            const existing = prev.find(i => i.name === item.name);
            if (existing) {
                return prev.map(i => i.name === item.name ? { ...i, qty: i.qty + 1 } : i);
            }
            return [...prev, { ...item, id: cartIdCounter++, qty: 1, discount: 0, gstRate: DEFAULT_GST }];
        });
    }, []);

    const addCustomItem = () => {
        const name = search.trim();
        if (!name) return;
        addToCart({ name, price: 100 });
        setSearch('');
    };

    const updateItem = (id, field, value) => {
        setCart(prev => prev.map(i => i.id === id ? { ...i, [field]: value } : i));
    };

    const removeItem = (id) => setCart(prev => prev.filter(i => i.id !== id));

    // ─── Print ───────────────────────────────────────────────────────────────
    const handlePrint = useReactToPrint({ contentRef: printRef });

    const showToast = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(''), 3000);
    };

    // ─── Save Bill ───────────────────────────────────────────────────────────
    const handleSave = async () => {
        if (cart.length === 0) { showToast('Add at least one item.'); return; }
        setSaving(true);
        try {
            const res = await createBillApi({
                customerName, customerPhone, notes,
                items: billData.items,
                subtotal: billData.subtotal,
                discountAmt: billData.discountAmt,
                gstAmt: billData.gstAmt,
                grandTotal: billData.grandTotal,
                gstRate,
            });
            setSavedBill(res.data.bill);
            showToast(`✅ Bill ${res.data.bill.billNumber} saved!`);
        } catch (err) {
            showToast('❌ Failed to save bill.');
        } finally {
            setSaving(false);
        }
    };

    const handleNewBill = () => {
        setCart([]); setCustomerName(''); setCustomerPhone('');
        setGlobalDiscount(0); setGstRate(DEFAULT_GST);
        setNotes(''); setSavedBill(null);
    };

    // ─── Filtered catalog ────────────────────────────────────────────────────
    const filtered = CATALOG.find(c => c.category === activeCategory)?.items.filter(i =>
        i.name.toLowerCase().includes(search.toLowerCase())
    ) || [];

    const inputCls = 'w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E85D75]/30 focus:border-[#E85D75] text-slate-800 bg-white';

    return (
        <div className="flex flex-col lg:flex-row gap-6 min-h-screen">
            {/* ── LEFT: Entry Panel ─────────────────────────────────────── */}
            <div className="flex-1 min-w-0 space-y-5">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">In-Store Billing 🧾</h1>
                        <p className="text-sm text-slate-500 mt-0.5">Create a new invoice for in-store customers.</p>
                    </div>
                    <a href="/admin/billing/history" className="text-xs text-[#C9A84C] hover:underline font-semibold">View History →</a>
                </div>

                {/* Customer Info */}
                <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
                    <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2"><User size={15} /> Customer Details <span className="text-slate-400 font-normal">(optional)</span></h3>
                    <div className="grid grid-cols-2 gap-3">
                        <input className={inputCls} placeholder="Customer Name" value={customerName} onChange={e => setCustomerName(e.target.value)} />
                        <input className={inputCls} placeholder="Phone Number" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} />
                    </div>
                </div>

                {/* Search / Barcode */}
                <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
                    <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2"><Search size={15} /> Search / Barcode / Custom Item</h3>
                    <div className="flex gap-2">
                        <input
                            ref={barcodeInputRef}
                            className={`${inputCls} flex-1`}
                            placeholder="Type item name or scan barcode…"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && addCustomItem()}
                        />
                        <button
                            onClick={addCustomItem}
                            className="px-4 py-2 bg-[#E85D75] text-white rounded-lg text-sm font-semibold hover:bg-[#C9416B] transition-colors flex items-center gap-1"
                        >
                            <Plus size={15} /> Add
                        </button>
                    </div>
                </div>

                {/* Quick-Add Grid */}
                <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
                    <h3 className="text-sm font-bold text-slate-700 mb-3">Quick Add by Category</h3>
                    {/* Category Tabs */}
                    <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
                        {CATALOG.map(c => (
                            <button
                                key={c.category}
                                onClick={() => setActiveCategory(c.category)}
                                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${activeCategory === c.category ? 'bg-[#E85D75] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                            >
                                {c.emoji} {c.category}
                            </button>
                        ))}
                    </div>
                    {/* Items Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {filtered.map(item => (
                            <button
                                key={item.name}
                                onClick={() => addToCart(item)}
                                className="flex flex-col items-start p-3 rounded-xl border border-dashed border-[#E85D75]/40 hover:border-[#E85D75] hover:bg-[#FFF0F4] transition-all text-left group"
                            >
                                <span className="text-xs font-semibold text-slate-800 group-hover:text-[#E85D75] transition-colors leading-tight">{item.name}</span>
                                <span className="text-xs text-[#C9A84C] font-bold mt-1">₹{item.price}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Cart Table */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                        <h3 className="text-sm font-bold text-slate-700">Cart ({cart.length} items)</h3>
                        {cart.length > 0 && <button onClick={() => setCart([])} className="text-xs text-red-400 hover:text-red-600">Clear all</button>}
                    </div>
                    {cart.length === 0 ? (
                        <div className="py-12 text-center text-slate-400 text-sm italic">No items added yet. Use quick-add or search above.</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-slate-50">
                                    <tr className="text-left text-xs text-slate-400 font-medium">
                                        <th className="py-3 px-4">Item</th>
                                        <th className="py-3 px-3 text-center">Qty</th>
                                        <th className="py-3 px-3 text-right">Unit ₹</th>
                                        <th className="py-3 px-3 text-right">Disc %</th>
                                        <th className="py-3 px-3 text-right">GST %</th>
                                        <th className="py-3 px-3 text-right">Total ₹</th>
                                        <th className="py-3 px-3" />
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {cart.map(item => (
                                        <motion.tr key={item.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                                            <td className="py-3 px-4 font-medium text-slate-800">{item.name}</td>
                                            <td className="py-3 px-3">
                                                <div className="flex items-center gap-1 justify-center">
                                                    <button onClick={() => updateItem(item.id, 'qty', Math.max(1, item.qty - 1))} className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors"><Minus size={11} /></button>
                                                    <span className="w-7 text-center text-sm font-semibold">{item.qty}</span>
                                                    <button onClick={() => updateItem(item.id, 'qty', item.qty + 1)} className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors"><Plus size={11} /></button>
                                                </div>
                                            </td>
                                            <td className="py-3 px-3 text-right">
                                                <input type="number" min="0" value={item.price} onChange={e => updateItem(item.id, 'price', +e.target.value)} className="w-20 text-right border border-slate-200 rounded-md px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-[#E85D75]/30" />
                                            </td>
                                            <td className="py-3 px-3 text-right">
                                                <input type="number" min="0" max="100" value={item.discount} onChange={e => updateItem(item.id, 'discount', +e.target.value)} className="w-16 text-right border border-slate-200 rounded-md px-2 py-1 text-xs focus:outline-none" />
                                            </td>
                                            <td className="py-3 px-3 text-right">
                                                <input type="number" min="0" max="28" value={item.gstRate} onChange={e => updateItem(item.id, 'gstRate', +e.target.value)} className="w-16 text-right border border-slate-200 rounded-md px-2 py-1 text-xs focus:outline-none" />
                                            </td>
                                            <td className="py-3 px-3 text-right font-bold text-slate-900">₹{calcItemTotal(item).toFixed(2)}</td>
                                            <td className="py-3 px-3">
                                                <button onClick={() => removeItem(item.id)} className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"><Trash2 size={14} /></button>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Global Discount & GST */}
                <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
                    <h3 className="text-sm font-bold text-slate-700 mb-3">Bill-Level Settings</h3>
                    <div className="grid grid-cols-3 gap-3">
                        <div>
                            <label className="text-xs text-slate-500 block mb-1">Global Discount %</label>
                            <input type="number" min="0" max="100" value={globalDiscount} onChange={e => setGlobalDiscount(+e.target.value)} className={inputCls} />
                        </div>
                        <div>
                            <label className="text-xs text-slate-500 block mb-1">Default GST Rate %</label>
                            <input type="number" min="0" max="28" value={gstRate} onChange={e => setGstRate(+e.target.value)} className={inputCls} />
                        </div>
                        <div>
                            <label className="text-xs text-slate-500 block mb-1">Notes</label>
                            <input type="text" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Optional…" className={inputCls} />
                        </div>
                    </div>
                </div>
            </div>

            {/* ── RIGHT: Invoice Preview ─────────────────────────────────── */}
            <div className="w-full lg:w-80 xl:w-96 flex-shrink-0 space-y-4">
                <div className="sticky top-4 space-y-4">
                    {/* Totals Card */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                        <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2"><Receipt size={15} className="text-[#E85D75]" /> Bill Summary</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between text-slate-600"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
                            {totalDiscountAmt > 0 && <div className="flex justify-between text-red-500"><span>Discount</span><span>− ₹{totalDiscountAmt.toFixed(2)}</span></div>}
                            <div className="flex justify-between text-slate-500"><span>GST ({gstRate}%)</span><span>₹{gstAmt.toFixed(2)}</span></div>
                            <div className="flex justify-between text-lg font-bold text-slate-900 border-t border-dashed border-slate-200 pt-3 mt-3">
                                <span>Grand Total</span>
                                <span className="text-[#E85D75]">₹{grandTotal.toFixed(2)}</span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-5 space-y-2">
                            <button
                                onClick={handleSave}
                                disabled={saving || cart.length === 0}
                                className="w-full flex items-center justify-center gap-2 py-3 bg-[#3B2A25] text-white rounded-xl font-semibold text-sm hover:bg-[#2A1F1B] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {saving ? 'Saving…' : <><Save size={15} /> Save Bill</>}
                            </button>
                            <button
                                onClick={() => handlePrint()}
                                className="w-full flex items-center justify-center gap-2 py-3 bg-[#E85D75] text-white rounded-xl font-semibold text-sm hover:bg-[#C9416B] transition-colors"
                            >
                                <Printer size={15} /> Print Receipt
                            </button>
                            {savedBill && (
                                <button
                                    onClick={handleNewBill}
                                    className="w-full flex items-center justify-center gap-2 py-3 border border-[#E85D75] text-[#E85D75] rounded-xl font-semibold text-sm hover:bg-[#FFF0F4] transition-colors"
                                >
                                    <Plus size={15} /> New Bill
                                </button>
                            )}
                        </div>

                        {savedBill && (
                            <div className="mt-3 flex items-center gap-2 text-emerald-600 text-xs font-semibold bg-emerald-50 rounded-lg px-3 py-2">
                                <CheckCircle size={14} />
                                Saved as {savedBill.billNumber}
                            </div>
                        )}
                    </div>

                    {/* Invoice Preview (print target) */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 overflow-auto max-h-[520px]">
                        <p className="text-xs text-slate-400 mb-2 text-center font-semibold uppercase tracking-wider">Receipt Preview</p>
                        <InvoicePrint ref={printRef} bill={billData} />
                    </div>
                </div>
            </div>

            {/* Toast */}
            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }}
                        className="fixed bottom-6 right-6 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl text-sm font-semibold z-50"
                    >
                        {toast}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminBilling;
