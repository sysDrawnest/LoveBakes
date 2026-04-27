import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useReactToPrint } from 'react-to-print';
import toast, { Toaster } from 'react-hot-toast';
import {
    Search,
    ShoppingCart,
    Trash2,
    Plus,
    Minus,
    User,
    Phone,
    Printer,
    Save,
    ShoppingBag,
    CreditCard,
    BanIcon,
    Barcode
} from 'lucide-react';
import InvoiceTemplate from './components/InvoiceTemplate';

const Billing = () => {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState('');
    const [cart, setCart] = useState([]);
    const [customer, setCustomer] = useState({ name: '', phone: '', gst: '' });
    const [paymentMethod, setPaymentMethod] = useState('CASH');
    const [loading, setLoading] = useState(false);
    const [savedBill, setSavedBill] = useState(null);

    const componentRef = useRef();
    const searchInputRef = useRef();

    useEffect(() => {
        fetchProducts();
        searchInputRef.current?.focus();
    }, []);

    const fetchProducts = async () => {
        try {
            const { data } = await axios.get('/api/billing/products');
            setProducts(data);
        } catch (error) {
            toast.error('Failed to load products');
        }
    };

    // Printing logic
    const handlePrint = useReactToPrint({
        contentRef: componentRef,
    });

    const handleSearch = (e) => {
        const val = e.target.value;
        setSearch(val);

        // Barcode scanning logic: usually scanners send EAN-13 (13 digits)
        const product = products.find(p => p.barcode === val);
        if (product) {
            addToCart(product);
            setSearch(''); // Clear for next scan
        }
    };

    const addToCart = (product) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item =>
                    item.id === product.id ? { ...item, qty: item.qty + 1, total: (item.qty + 1) * item.price * (1 + item.gst / 100) } : item
                );
            }
            const itemGst = (product.price * product.gst) / 100;
            return [...prev, {
                ...product,
                qty: 1,
                itemGst: itemGst,
                total: product.price + itemGst
            }];
        });
        toast.success(`${product.name} added`);
    };

    const updateQty = (id, delta) => {
        setCart(prev => prev.map(item => {
            if (item.id === id) {
                const newQty = Math.max(1, item.qty + delta);
                const itemGst = (item.price * item.gst) / 100;
                return { ...item, qty: newQty, total: newQty * (item.price + itemGst) };
            }
            return item;
        }));
    };

    const removeFromCart = (id) => {
        setCart(prev => prev.filter(item => item.id !== id));
    };

    const totals = cart.reduce((acc, item) => {
        const itemTax = (item.price * item.gst / 100) * item.qty;
        acc.subtotal += item.price * item.qty;
        acc.totalGst += itemTax;
        acc.grandTotal += (item.price * item.qty) + itemTax;
        return acc;
    }, { subtotal: 0, totalGst: 0, grandTotal: 0 });

    const saveBill = async () => {
        if (cart.length === 0) {
            toast.error('Cart is empty');
            return;
        }

        setLoading(true);
        try {
            const billData = {
                customerName: customer.name,
                customerPhone: customer.phone,
                customerGst: customer.gst,
                items: cart,
                subtotal: totals.subtotal,
                discount: 0, // Implementable later
                totalGst: totals.totalGst,
                grandTotal: totals.grandTotal,
                paymentMethod
            };

            const { data } = await axios.post('/api/billing/bills', billData);
            setSavedBill(data);
            toast.success('Bill saved successfully!');

            // Auto open print dialog
            setTimeout(() => handlePrint(), 500);

            // Reset
            setCart([]);
            setCustomer({ name: '', phone: '', gst: '' });
        } catch (error) {
            toast.error('Failed to save bill');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FFF9F0] p-6 lg:p-10 font-sans text-[#2D3436]">
            <Toaster position="top-right" />

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* Left: Product Search and Selection */}
                <div className="lg:col-span-7 space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#FFE66D]/30">
                        <h2 className="text-2xl font-serif font-bold text-[#FF6B6B] mb-6 flex items-center gap-2">
                            <ShoppingBag className="w-6 h-6" /> Shop Inventory
                        </h2>

                        <div className="relative mb-6">
                            <Barcode className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                ref={searchInputRef}
                                type="text"
                                placeholder="Scan Barcode or Search Product..."
                                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-[#FF6B6B] focus:ring-0 transition-all outline-none"
                                value={search}
                                onChange={handleSearch}
                                autoFocus
                            />
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 h-[500px] overflow-y-auto pr-2 scrollbar-thin">
                            {products
                                .filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.barcode.includes(search))
                                .map(product => (
                                    <button
                                        key={product.id}
                                        onClick={() => addToCart(product)}
                                        className="p-4 bg-white border border-gray-100 rounded-xl hover:border-[#FF6B6B] hover:shadow-md transition-all text-left flex flex-col justify-between group"
                                    >
                                        <div>
                                            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider h-4 block">
                                                {product.category}
                                            </span>
                                            <h3 className="font-bold text-sm line-clamp-2 mt-1">{product.name}</h3>
                                        </div>
                                        <div className="mt-4 flex justify-between items-end">
                                            <span className="font-bold text-[#FF6B6B]">₹{product.price}</span>
                                            <div className="bg-[#FF6B6B]/10 p-1.5 rounded-lg text-[#FF6B6B] group-hover:bg-[#FF6B6B] group-hover:text-white transition-colors">
                                                <Plus size={16} />
                                            </div>
                                        </div>
                                    </button>
                                ))}
                        </div>
                    </div>
                </div>

                {/* Right: Cart and Billing Summary */}
                <div className="lg:col-span-5 space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#FFE66D]/30 flex flex-col h-full">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2 border-b pb-4">
                            <ShoppingCart className="w-5 h-5" /> Current Order
                        </h2>

                        {/* Cart Items */}
                        <div className="flex-grow overflow-y-auto space-y-4 pr-2 mb-6 min-h-[300px]">
                            {cart.length === 0 ? (
                                <div className="text-center py-20 text-gray-400">
                                    <ShoppingCart className="w-12 h-12 mx-auto mb-2 opacity-20" />
                                    <p>Cart is empty. Start scanning!</p>
                                </div>
                            ) : (
                                cart.map(item => (
                                    <div key={item.id} className="flex items-center gap-4 bg-gray-50 p-3 rounded-xl">
                                        <div className="flex-grow">
                                            <h4 className="font-bold text-sm">{item.name}</h4>
                                            <p className="text-xs text-gray-500">₹{item.price} + {item.gst}% GST</p>
                                        </div>
                                        <div className="flex items-center gap-3 bg-white rounded-lg p-1 border">
                                            <button onClick={() => updateQty(item.id, -1)} className="p-1 hover:text-[#FF6B6B]"><Minus size={14} /></button>
                                            <span className="font-bold text-sm w-4 text-center">{item.qty}</span>
                                            <button onClick={() => updateQty(item.id, 1)} className="p-1 hover:text-[#FF6B6B]"><Plus size={14} /></button>
                                        </div>
                                        <div className="text-right min-w-[60px]">
                                            <p className="font-bold text-sm">₹{item.total.toFixed(0)}</p>
                                            <button onClick={() => removeFromCart(item.id)} className="text-gray-300 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Customer Info */}
                        <div className="space-y-4 border-t pt-6 bg-white z-10">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                                    <input
                                        type="text"
                                        placeholder="Customer Name"
                                        className="w-full pl-9 pr-3 py-2 bg-gray-50 border rounded-lg text-sm focus:border-[#FF6B6B] outline-none"
                                        value={customer.name}
                                        onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                                    />
                                </div>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                                    <input
                                        type="text"
                                        placeholder="Phone Number"
                                        className="w-full pl-9 pr-3 py-2 bg-gray-50 border rounded-lg text-sm focus:border-[#FF6B6B] outline-none"
                                        value={customer.phone}
                                        onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Payment Method */}
                            <div className="flex gap-2">
                                {['CASH', 'UPI', 'CARD'].map(method => (
                                    <button
                                        key={method}
                                        onClick={() => setPaymentMethod(method)}
                                        className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${paymentMethod === method
                                                ? 'bg-[#FF6B6B] text-white shadow-md'
                                                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                            }`}
                                    >
                                        {method}
                                    </button>
                                ))}
                            </div>

                            {/* Summary Totals */}
                            <div className="bg-[#FFE66D]/10 p-4 rounded-xl space-y-2 border border-[#FFE66D]/20">
                                <div className="flex justify-between text-sm">
                                    <span>Subtotal</span>
                                    <span className="font-semibold">₹{totals.subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span>Total GST</span>
                                    <span className="font-semibold text-[#FF6B6B]">₹{totals.totalGst.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold border-t border-[#FFE66D]/30 pt-2 text-[#2D3436]">
                                    <span>Grand Total</span>
                                    <span>₹{totals.grandTotal.toFixed(0)}</span>
                                </div>
                            </div>

                            <button
                                onClick={saveBill}
                                disabled={loading || cart.length === 0}
                                className="w-full bg-[#FF6B6B] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#ff5a5a] shadow-lg shadow-[#FF6B6B]/20 transition-all disabled:opacity-50"
                            >
                                {loading ? 'Processing...' : <><Save size={20} /> Save & Print Bill</>}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Hidden invoice for printing */}
            <div style={{ display: 'none' }}>
                <InvoiceTemplate ref={componentRef} billData={savedBill} />
            </div>
        </div>
    );
};

export default Billing;
