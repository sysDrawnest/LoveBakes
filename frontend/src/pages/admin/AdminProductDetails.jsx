import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getProductByIdApi, createProductApi, updateProductApi } from '../../api/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft,
    Save,
    Plus,
    Trash2,
    Image as ImageIcon,
    X,
    Star,
    Loader2
} from 'lucide-react';

const AdminProductDetails = () => {
    const { id } = useParams();
    const isEdit = Boolean(id);
    const navigate = useNavigate();

    const [loading, setLoading] = useState(isEdit);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: 'Cakes',
        images: [],
        flavors: [],
        sizes: [{ size: '500g', price: 0 }]
    });

    const [newImageUrl, setNewImageUrl] = useState('');
    const [flavorInput, setFlavorInput] = useState('');

    useEffect(() => {
        if (isEdit) {
            fetchProduct();
        }
    }, [id]);

    const fetchProduct = async () => {
        try {
            const res = await getProductByIdApi(id);
            const p = res.data;
            setFormData({
                name: p.name || '',
                description: p.description || '',
                category: p.category || 'Cakes',
                images: p.images || [],
                flavors: p.flavors || [],
                sizes: p.sizes?.length > 0 ? p.sizes : [{ size: '500g', price: 0 }]
            });
        } catch (error) {
            alert('Failed to fetch product details');
            navigate('/admin/products');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (isEdit) {
                // Partial Update: we send the current images list
                // Backend logic treats req.body.images as new ones to append usually, 
                // but since we want to control the full list/order, we'll send it as 'existingImages'
                // or just 'images' depending on how we want the backend to behave. 
                // Based on our controller update: it expects 'existingImages' for reordering/subset
                await updateProductApi(id, {
                    ...formData,
                    existingImages: formData.images
                });
            } else {
                await createProductApi(formData);
            }
            navigate('/admin/products');
        } catch (error) {
            alert('Failed to save product');
        } finally {
            setSaving(false);
        }
    };

    const handleAddImage = () => {
        if (!newImageUrl.trim()) return;
        setFormData(prev => ({
            ...prev,
            images: [...prev.images, newImageUrl.trim()]
        }));
        setNewImageUrl('');
    };

    const removeImage = (index) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const setPrimaryImage = (index) => {
        const newImages = [...formData.images];
        const [selected] = newImages.splice(index, 1);
        setFormData(prev => ({
            ...prev,
            images: [selected, ...newImages]
        }));
    };

    const handleAddFlavor = (e) => {
        if (e.key === 'Enter' && flavorInput.trim()) {
            e.preventDefault();
            if (!formData.flavors.includes(flavorInput.trim())) {
                setFormData(prev => ({
                    ...prev,
                    flavors: [...prev.flavors, flavorInput.trim()]
                }));
            }
            setFlavorInput('');
        }
    };

    const removeFlavor = (f) => {
        setFormData(prev => ({
            ...prev,
            flavors: prev.flavors.filter(item => item !== f)
        }));
    };

    const handleSizeChange = (index, field, value) => {
        const newSizes = [...formData.sizes];
        newSizes[index][field] = value;
        setFormData({ ...formData, sizes: newSizes });
    };

    const addSize = () => {
        setFormData(prev => ({
            ...prev,
            sizes: [...prev.sizes, { size: '1kg', price: 0 }]
        }));
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="animate-spin text-[#C9A84C]" size={40} />
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <button
                    onClick={() => navigate('/admin/products')}
                    className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors group"
                >
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="font-medium">Back to Inventory</span>
                </button>
                <h1 className="text-2xl font-bold text-slate-900">
                    {isEdit ? 'Edit Product' : 'Add New Product'}
                </h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Main Info */}
                    <div className="lg:col-span-2 space-y-6">
                        <section className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-50 pb-3">General Information</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Product Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-[#C9A84C]/20 focus:border-[#C9A84C] transition-all outline-none"
                                        placeholder="e.g. Classic Red Velvet Cake"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Description</label>
                                    <textarea
                                        rows="4"
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-[#C9A84C]/20 focus:border-[#C9A84C] transition-all outline-none resize-none"
                                        placeholder="Describe the taste, ingredients, and vibes..."
                                    />
                                </div>
                            </div>
                        </section>

                        <section className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-50 pb-3">Sizes & Pricing</h2>
                            <div className="space-y-3">
                                {formData.sizes.map((s, i) => (
                                    <div key={i} className="flex gap-3 items-center">
                                        <select
                                            value={s.size}
                                            onChange={e => handleSizeChange(i, 'size', e.target.value)}
                                            className="w-32 px-4 py-2.5 bg-slate-50 border-transparent rounded-xl outline-none focus:ring-2 focus:ring-[#C9A84C]/20"
                                        >
                                            <option value="500g">500g</option>
                                            <option value="1kg">1kg</option>
                                            <option value="2kg">2kg</option>
                                            <option value="Custom">Custom</option>
                                        </select>
                                        <div className="relative flex-1">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                                            <input
                                                type="number"
                                                required
                                                value={s.price}
                                                onChange={e => handleSizeChange(i, 'price', Number(e.target.value))}
                                                className="w-full pl-8 pr-4 py-2.5 bg-slate-50 border-transparent rounded-xl outline-none focus:ring-2 focus:ring-[#C9A84C]/20"
                                                placeholder="0.00"
                                            />
                                        </div>
                                        {formData.sizes.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => setFormData(prev => ({ ...prev, sizes: prev.sizes.filter((_, idx) => idx !== i) }))}
                                                className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={addSize}
                                    className="w-full py-2 border-2 border-dashed border-slate-100 text-slate-400 hover:border-[#C9A84C]/30 hover:text-[#C9A84C] rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2"
                                >
                                    <Plus size={16} /> Add Another Size
                                </button>
                            </div>
                        </section>

                        <section className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-50 pb-3">Flavors</h2>
                            <div className="flex flex-wrap gap-2 mb-3">
                                <AnimatePresence>
                                    {formData.flavors.map(f => (
                                        <motion.span
                                            key={f}
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.8 }}
                                            className="flex items-center gap-1.5 bg-slate-100 text-slate-700 px-3 py-1.5 rounded-full text-sm font-bold border border-slate-200"
                                        >
                                            {f}
                                            <button type="button" onClick={() => removeFlavor(f)}><X size={14} className="hover:text-red-500" /></button>
                                        </motion.span>
                                    ))}
                                </AnimatePresence>
                            </div>
                            <input
                                type="text"
                                placeholder="Type flavor and press Enter..."
                                value={flavorInput}
                                onChange={e => setFlavorInput(e.target.value)}
                                onKeyDown={handleAddFlavor}
                                className="w-full px-4 py-2.5 bg-slate-50 border-transparent rounded-xl outline-none focus:ring-2 focus:ring-[#C9A84C]/20"
                            />
                        </section>
                    </div>

                    {/* Media & Sidebar Settings */}
                    <div className="space-y-6">
                        <section className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-50 pb-3">Product Media</h2>

                            {/* Image Previews */}
                            <div className="grid grid-cols-2 gap-3">
                                {formData.images.map((img, i) => (
                                    <div key={i} className="relative aspect-square rounded-2xl overflow-hidden group border border-slate-100 shadow-sm bg-slate-50">
                                        <img src={img} alt="" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() => setPrimaryImage(i)}
                                                className={`p-1.5 rounded-lg transition-all ${i === 0 ? 'bg-amber-500 text-white' : 'bg-white/20 text-white hover:bg-white/40'}`}
                                                title="Set as Featured"
                                            >
                                                <Star size={16} fill={i === 0 ? "currentColor" : "none"} />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => removeImage(i)}
                                                className="p-1.5 bg-white/20 text-white hover:bg-red-500 rounded-lg transition-all"
                                                title="Delete Image"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                        {i === 0 && (
                                            <div className="absolute top-2 left-2 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg uppercase tracking-widest">
                                                Featured
                                            </div>
                                        )}
                                    </div>
                                ))}

                                {/* Add New Image Trigger */}
                                <div className="aspect-square border-2 border-dashed border-slate-100 rounded-2xl flex items-center justify-center text-slate-300 hover:border-[#C9A84C]/30 hover:text-[#C9A84C] transition-all cursor-pointer">
                                    <ImageIcon size={24} />
                                </div>
                            </div>

                            <div className="pt-4 flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Paste Image URL..."
                                    value={newImageUrl}
                                    onChange={e => setNewImageUrl(e.target.value)}
                                    className="flex-1 px-3 py-1.5 bg-slate-50 border-transparent rounded-xl text-sm outline-none"
                                />
                                <button
                                    type="button"
                                    onClick={handleAddImage}
                                    className="bg-slate-900 text-white p-2 rounded-xl hover:bg-slate-800 transition-colors"
                                >
                                    <Plus size={18} />
                                </button>
                            </div>
                        </section>

                        <section className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-50 pb-3">Organization</h2>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1.5">Category</label>
                                <select
                                    value={formData.category}
                                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-slate-50 border-transparent rounded-xl outline-none focus:ring-2 focus:ring-[#C9A84C]/20"
                                >
                                    {['Cakes', 'Custom Cakes', 'Pastries', 'Cookies', 'Cupcakes', 'Desserts'].map(c => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                            </div>
                        </section>

                        <button
                            type="submit"
                            disabled={saving}
                            className="w-full bg-[#C9A84C] hover:bg-[#B6963E] text-slate-900 font-black py-4 rounded-2xl transition-all shadow-xl shadow-gold/20 flex items-center justify-center gap-3 disabled:opacity-50"
                        >
                            {saving ? <Loader2 className="animate-spin" size={24} /> : <Save size={24} />}
                            <span>{isEdit ? 'SAVE CHANGES' : 'CREATE PRODUCT'}</span>
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default AdminProductDetails;
