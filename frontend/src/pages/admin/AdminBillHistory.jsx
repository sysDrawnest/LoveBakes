import { useState, useEffect, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { motion } from 'framer-motion';
import { Receipt, Search, Calendar, Printer, X, TrendingUp, DollarSign, FileText } from 'lucide-react';
import { getBillsApi, getDailySummaryApi } from '../../api/api';
import InvoicePrint from './components/InvoicePrint';

const AdminBillHistory = () => {
    const [bills, setBills] = useState([]);
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [dateFilter, setDateFilter] = useState('');
    const [selectedBill, setSelectedBill] = useState(null);
    const printRef = useRef();

    const handlePrint = useReactToPrint({ contentRef: printRef });

    const fetchBills = async () => {
        setLoading(true);
        try {
            const params = {};
            if (search) params.customer = search;
            if (dateFilter) params.date = dateFilter;
            const [billsRes, summaryRes] = await Promise.all([
                getBillsApi(params),
                getDailySummaryApi(),
            ]);
            setBills(billsRes.data.bills || []);
            setSummary(summaryRes.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchBills(); }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchBills();
    };

    const inputCls = 'border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E85D75]/30 focus:border-[#E85D75] text-slate-800 bg-white';

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Bill History 📋</h1>
                    <p className="text-sm text-slate-500 mt-0.5">View and reprint past invoices.</p>
                </div>
                <a href="/admin/billing" className="px-4 py-2 bg-[#E85D75] text-white rounded-xl text-sm font-semibold hover:bg-[#C9416B] transition-colors">
                    + New Bill
                </a>
            </div>

            {/* Today's Summary */}
            {summary && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: 'Bills Today', value: summary.totalBills, icon: <FileText size={18} />, color: 'bg-blue-50 text-blue-600' },
                        { label: "Today's Revenue", value: `₹${summary.totalRevenue?.toFixed(0)}`, icon: <DollarSign size={18} />, color: 'bg-emerald-50 text-emerald-600' },
                        { label: 'GST Collected', value: `₹${summary.totalGST?.toFixed(0)}`, icon: <TrendingUp size={18} />, color: 'bg-amber-50 text-amber-600' },
                        { label: 'Total Discount', value: `₹${summary.totalDiscount?.toFixed(0)}`, icon: <Receipt size={18} />, color: 'bg-rose-50 text-rose-600' },
                    ].map((s, i) => (
                        <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                            className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
                            <div className={`w-10 h-10 rounded-xl ${s.color} flex items-center justify-center mb-3`}>{s.icon}</div>
                            <p className="text-xs text-slate-500">{s.label}</p>
                            <p className="text-xl font-bold text-slate-900">{s.value}</p>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Filters */}
            <form onSubmit={handleSearch} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex flex-wrap gap-3 items-end">
                <div className="flex-1 min-w-40">
                    <label className="text-xs text-slate-500 block mb-1 flex items-center gap-1"><Search size={11} /> Customer Name / Phone</label>
                    <input className={`${inputCls} w-full`} value={search} onChange={e => setSearch(e.target.value)} placeholder="Search customer…" />
                </div>
                <div>
                    <label className="text-xs text-slate-500 block mb-1 flex items-center gap-1"><Calendar size={11} /> Date</label>
                    <input type="date" className={inputCls} value={dateFilter} onChange={e => setDateFilter(e.target.value)} />
                </div>
                <button type="submit" className="px-5 py-2 bg-[#3B2A25] text-white rounded-lg text-sm font-semibold hover:bg-[#2A1F1B] transition-colors">Search</button>
                <button type="button" onClick={() => { setSearch(''); setDateFilter(''); setTimeout(fetchBills, 100); }} className="px-4 py-2 text-slate-500 hover:bg-slate-100 rounded-lg text-sm transition-colors">Clear</button>
            </form>

            {/* Bill Table */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50">
                            <tr className="text-left text-xs text-slate-400 font-medium">
                                <th className="py-4 px-5">Bill No</th>
                                <th className="py-4 px-5">Customer</th>
                                <th className="py-4 px-5">Items</th>
                                <th className="py-4 px-5 text-right">Total</th>
                                <th className="py-4 px-5 text-right">GST</th>
                                <th className="py-4 px-5">Date</th>
                                <th className="py-4 px-5">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        {Array.from({ length: 7 }).map((_, j) => (
                                            <td key={j} className="py-4 px-5"><div className="h-4 bg-slate-100 rounded w-20" /></td>
                                        ))}
                                    </tr>
                                ))
                            ) : bills.length === 0 ? (
                                <tr><td colSpan={7} className="py-16 text-center text-slate-400 italic">No bills found.</td></tr>
                            ) : bills.map(bill => {
                                const items = Array.isArray(bill.items) ? bill.items : JSON.parse(bill.items || '[]');
                                return (
                                    <tr key={bill.id} className="hover:bg-slate-50/60 transition-colors cursor-pointer" onClick={() => setSelectedBill(bill)}>
                                        <td className="py-3 px-5 font-mono text-xs text-[#C9A84C] font-bold">{bill.billNumber}</td>
                                        <td className="py-3 px-5 text-slate-700">
                                            <div>{bill.customerName || <span className="text-slate-400 italic">Walk-in</span>}</div>
                                            {bill.customerPhone && <div className="text-xs text-slate-400">{bill.customerPhone}</div>}
                                        </td>
                                        <td className="py-3 px-5 text-slate-500 text-xs">{items.length} item{items.length !== 1 ? 's' : ''}</td>
                                        <td className="py-3 px-5 text-right font-bold text-slate-900">₹{bill.grandTotal?.toFixed(2)}</td>
                                        <td className="py-3 px-5 text-right text-slate-500">₹{bill.gstAmt?.toFixed(2)}</td>
                                        <td className="py-3 px-5 text-slate-500 text-xs">
                                            {new Date(bill.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            <div>{new Date(bill.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}</div>
                                        </td>
                                        <td className="py-3 px-5">
                                            <button
                                                onClick={e => { e.stopPropagation(); setSelectedBill(bill); }}
                                                className="text-xs px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg font-semibold text-slate-700 transition-colors flex items-center gap-1"
                                            >
                                                <Printer size={12} /> View
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Bill Detail Modal */}
            {selectedBill && (
                <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-3xl w-full max-w-sm max-h-[90vh] overflow-y-auto shadow-2xl">
                        <div className="flex justify-between items-center p-4 border-b border-slate-100">
                            <h3 className="font-bold text-slate-900">Invoice {selectedBill.billNumber}</h3>
                            <div className="flex items-center gap-2">
                                <button onClick={() => handlePrint()} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#E85D75] text-white rounded-lg text-xs font-semibold hover:bg-[#C9416B] transition-colors">
                                    <Printer size={13} /> Print
                                </button>
                                <button onClick={() => setSelectedBill(null)} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
                                    <X size={18} className="text-slate-500" />
                                </button>
                            </div>
                        </div>
                        <div className="p-4">
                            <InvoicePrint ref={printRef} bill={selectedBill} />
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default AdminBillHistory;
