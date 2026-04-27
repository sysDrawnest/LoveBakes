import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Settings,
    Store,
    Bell,
    ShieldCheck,
    Globe,
    Save,
    Clock,
    CreditCard,
    Mail
} from 'lucide-react';

const AdminSettings = () => {
    const [saving, setSaving] = useState(false);

    const handleSave = () => {
        setSaving(true);
        setTimeout(() => {
            setSaving(false);
            alert('Settings saved successfully!');
        }, 1000);
    };

    const sections = [
        {
            title: 'Store Information',
            icon: <Store className="text-amber-500" size={20} />,
            fields: [
                { label: 'Store Name', type: 'text', placeholder: 'LoveBakes', defaultValue: 'LoveBakes' },
                { label: 'Support Email', type: 'email', placeholder: 'support@lovebakes.com', defaultValue: 'hello@lovebakes.com' },
                { label: 'Contact Phone', type: 'text', placeholder: '+91 98765 43210', defaultValue: '+91 99999 88888' },
            ]
        },
        {
            title: 'Operational Status',
            icon: <Clock className="text-blue-500" size={20} />,
            fields: [
                { label: 'Store Status', type: 'select', options: ['Open', 'Closed', 'Paused'], defaultValue: 'Open' },
                { label: 'Delivery Radius (km)', type: 'number', placeholder: '10', defaultValue: '15' },
            ]
        },
        {
            title: 'Notifications',
            icon: <Bell className="text-purple-500" size={20} />,
            fields: [
                { label: 'New Order Alerts', type: 'toggle', defaultValue: true },
                { label: 'Email Reports (Daily)', type: 'toggle', defaultValue: false },
                { label: 'WhatsApp Notifications', type: 'toggle', defaultValue: true },
            ]
        }
    ];

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
                    <p className="text-slate-500">Global configurations for your bakery management suite.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 bg-[#C9A84C] hover:bg-[#B6963E] text-slate-900 font-bold py-2.5 px-6 rounded-xl transition-all shadow-lg shadow-gold/10 disabled:opacity-50"
                >
                    {saving ? <ShieldCheck className="animate-pulse" size={20} /> : <Save size={20} />}
                    <span>{saving ? 'Saving...' : 'Save All Changes'}</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Navigation Sidebar (Local) */}
                <div className="space-y-1">
                    {sections.map((s, i) => (
                        <button
                            key={i}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${i === 0 ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-100'}`}
                        >
                            {s.icon}
                            {s.title}
                        </button>
                    ))}
                    <div className="pt-4 mt-4 border-t border-slate-100">
                        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all">
                            <ShieldCheck size={20} />
                            Reset All Data
                        </button>
                    </div>
                </div>

                {/* Settings Form */}
                <div className="md:col-span-2 space-y-6">
                    {sections.map((section, idx) => (
                        <motion.section
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6"
                        >
                            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                {section.icon}
                                {section.title}
                            </h3>

                            <div className="grid grid-cols-1 gap-6">
                                {section.fields.map((field, fIdx) => (
                                    <div key={fIdx}>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">{field.label}</label>
                                        {field.type === 'toggle' ? (
                                            <div className="flex items-center gap-3">
                                                <div className={`w-12 h-6 rounded-full relative transition-colors cursor-pointer ${field.defaultValue ? 'bg-[#C9A84C]' : 'bg-slate-200'}`}>
                                                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${field.defaultValue ? 'right-1' : 'left-1'}`} />
                                                </div>
                                                <span className="text-sm text-slate-500">{field.defaultValue ? 'Enabled' : 'Disabled'}</span>
                                            </div>
                                        ) : field.type === 'select' ? (
                                            <select className="w-full px-4 py-2.5 bg-slate-50 border border-transparent rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-[#C9A84C]/20 focus:border-[#C9A84C]">
                                                {field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                            </select>
                                        ) : (
                                            <input
                                                type={field.type}
                                                defaultValue={field.defaultValue}
                                                placeholder={field.placeholder}
                                                className="w-full px-4 py-2.5 bg-slate-50 border border-transparent rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-[#C9A84C]/20 focus:border-[#C9A84C]"
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </motion.section>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminSettings;
