import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import { sendMessageApi } from '../api/api';

const Contact = () => {
 const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
 const [isSubmitting, setIsSubmitting] = useState(false);
 const [submitStatus, setSubmitStatus] = useState(null);

 const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

 const handleSubmit = async (e) => {
 e.preventDefault();
 setIsSubmitting(true);
 setSubmitStatus(null);
 try {
 await sendMessageApi(formData);
 setSubmitStatus('success');
 setFormData({ name: '', email: '', subject: '', message: '' });
 } catch (error) {
 setSubmitStatus('error');
 } finally {
 setIsSubmitting(false);
 }
 };

 return (
 <div className="pt-24 pb-16 min-h-screen bg-[#FFF6F2]">
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
 {/* Header Section */}
 <motion.div
 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
 className="text-center mb-16"
 >
 <h1 className="text-4xl md:text-5xl font-bold text-[#3B2A25] mb-4">Get in Touch</h1>
 <p className="text-lg text-[#C9A27E] max-w-2xl mx-auto">
 We'd love to hear from you! Whether you have a question about an order,
 want to discuss a custom cake, or just want to say hi.
 </p>
 </motion.div>

 <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
 {/* Contact Information & Map */}
 <motion.div
 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
 className="space-y-8"
 >
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
 <div className="bg-white p-6 rounded-2xl shadow-[0_4px_20px_rgba(74,51,44,0.06)]">
 <div className="w-12 h-12 bg-[#C9A27E]/30 rounded-xl flex items-center justify-center text-[#3B2A25] mb-4">
 <MapPin className="w-6 h-6" />
 </div>
 <h3 className="font-bold text-[#3B2A25] mb-2">Our Location</h3>
 <p className="text-[#C9A27E] text-sm">
 123 Bakery Street<br />
 Sweet City, SC 12345
 </p>
 </div>

 <div className="bg-white p-6 rounded-2xl shadow-[0_4px_20px_rgba(74,51,44,0.06)]">
 <div className="w-12 h-12 bg-[#C9A27E]/30 rounded-xl flex items-center justify-center text-[#3B2A25] mb-4">
 <Phone className="w-6 h-6" />
 </div>
 <h3 className="font-bold text-[#3B2A25] mb-2">Phone</h3>
 <p className="text-[#C9A27E] text-sm">+91 8144622958</p>
 </div>

 <div className="bg-white p-6 rounded-2xl shadow-[0_4px_20px_rgba(74,51,44,0.06)]">
 <div className="w-12 h-12 bg-[#C9A27E]/30 rounded-xl flex items-center justify-center text-[#3B2A25] mb-4">
 <Mail className="w-6 h-6" />
 </div>
 <h3 className="font-bold text-[#3B2A25] mb-2">Email</h3>
 <p className="text-[#C9A27E] text-sm">sethysaiyangyadatta@<br />gmail.com</p>
 </div>

 <div className="bg-white p-6 rounded-2xl shadow-[0_4px_20px_rgba(74,51,44,0.06)]">
 <div className="w-12 h-12 bg-[#C9A27E]/30 rounded-xl flex items-center justify-center text-[#3B2A25] mb-4">
 <Clock className="w-6 h-6" />
 </div>
 <h3 className="font-bold text-[#3B2A25] mb-2">Hours</h3>
 <p className="text-[#C9A27E] text-sm">
 Mon-Sat: 9am - 8pm<br />
 Sun: 10am - 6pm
 </p>
 </div>
 </div>

 {/* Map Embed */}
 <div className="bg-white p-2 rounded-2xl shadow-[0_4px_20px_rgba(74,51,44,0.06)] h-64 overflow-hidden relative">
 <iframe
 src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3742.8753232187654!2d85.81179731492026!3d20.2641031864161!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a19a7702db06f15%3A0xa6131cfa28a11bc3!2sBhubaneswar%2C%20Odisha!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin"
 width="100%"
 height="100%"
 style={{ border: 0 }}
 allowFullScreen=""
 loading="lazy"
 className="rounded-xl w-full h-full"
 title="Shop Location"
 ></iframe>
 </div>
 </motion.div>

 {/* Contact Form */}
 <motion.div
 initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
 className="bg-white p-8 rounded-3xl shadow-[0_4px_24px_rgba(74,51,44,0.08)]"
 >
 <h2 className="text-2xl font-bold text-[#3B2A25] mb-6">Send us a Message</h2>

 {submitStatus === 'success' && (
 <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-xl border border-green-200">
 Thank you for your message! We'll get back to you soon.
 </div>
 )}
 {submitStatus === 'error' && (
 <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl border border-red-200">
 Failed to send message. Please try again later.
 </div>
 )}

 <form onSubmit={handleSubmit} className="space-y-5">
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
 <div>
 <label className="block text-sm font-medium text-[#3B2A25] mb-2">Your Name</label>
 <input
 type="text" name="name" required
 value={formData.name} onChange={handleChange}
 className="w-full px-4 py-3 bg-[#FFF6F2] border border-[#C9A27E] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3B2A25]/30 text-[#3B2A25] transition-shadow"
 placeholder="John Doe"
 />
 </div>
 <div>
 <label className="block text-sm font-medium text-[#3B2A25] mb-2">Email Address</label>
 <input
 type="email" name="email" required
 value={formData.email} onChange={handleChange}
 className="w-full px-4 py-3 bg-[#FFF6F2] border border-[#C9A27E] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3B2A25]/30 text-[#3B2A25] transition-shadow"
 placeholder="john@example.com"
 />
 </div>
 </div>

 <div>
 <label className="block text-sm font-medium text-[#3B2A25] mb-2">Subject</label>
 <input
 type="text" name="subject"
 value={formData.subject} onChange={handleChange}
 className="w-full px-4 py-3 bg-[#FFF6F2] border border-[#C9A27E] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3B2A25]/30 text-[#3B2A25] transition-shadow"
 placeholder="Order Inquiry / Custom Cake / etc."
 />
 </div>

 <div>
 <label className="block text-sm font-medium text-[#3B2A25] mb-2">Message</label>
 <textarea
 name="message" required rows="5"
 value={formData.message} onChange={handleChange}
 className="w-full px-4 py-3 bg-[#FFF6F2] border border-[#C9A27E] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3B2A25]/30 text-[#3B2A25] transition-shadow resize-none"
 placeholder="How can we help you?"
 ></textarea>
 </div>

 <button
 type="submit" disabled={isSubmitting}
 className="w-full py-4 bg-[#E85D75] text-white rounded-xl font-bold hover:bg-[#3A2722] transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
 >
 {isSubmitting ? 'Sending...' : (
 <>Send Message <Send className="w-5 h-5" /></>
 )}
 </button>
 </form>
 </motion.div>
 </div>
 </div>
 </div>
 );
};

export default Contact;
