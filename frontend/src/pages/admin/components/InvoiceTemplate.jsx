import React, { forwardRef } from 'react';

const InvoiceTemplate = forwardRef(({ billData }, ref) => {
    if (!billData) return null;

    const {
        invoiceNumber,
        customerName,
        customerPhone,
        items,
        subtotal,
        discount,
        totalGst,
        grandTotal,
        createdAt
    } = billData;

    const date = new Date(createdAt || Date.now()).toLocaleString();

    return (
        <div ref={ref} className="p-8 bg-white text-[#2D3436] font-sans max-w-[800px] mx-auto print:m-0 print:p-8">
            {/* Header */}
            <div className="text-center border-b-2 border-gray-100 pb-6 mb-6">
                <h1 className="text-3xl font-serif font-bold text-[#FF6B6B] uppercase tracking-wider mb-1">
                    ❤️ Love Bakes
                </h1>
                <p className="text-sm italic text-gray-500 mb-2">Freshly Baked with Love</p>
                <p className="text-xs">123 Baker Street, Sweet Town</p>
                <p className="text-xs font-semibold mt-1">GST: 23AAAAA0000A1Z</p>
                <p className="text-xs">Tel: +91 98765 43210</p>
            </div>

            {/* Bill Info */}
            <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                <div>
                    <p><span className="font-bold">Bill No:</span> {invoiceNumber}</p>
                    <p><span className="font-bold">Date:</span> {date}</p>
                </div>
                <div className="text-right">
                    <p><span className="font-bold">Customer:</span> {customerName || 'Walk-in'}</p>
                    <p><span className="font-bold">Phone:</span> {customerPhone || 'N/A'}</p>
                </div>
            </div>

            {/* Items Table */}
            <table className="w-full text-sm mb-6 border-collapse">
                <thead>
                    <tr className="border-t border-b border-gray-200">
                        <th className="py-2 text-left">Item</th>
                        <th className="py-2 text-center">Qty</th>
                        <th className="py-2 text-right">Price</th>
                        <th className="py-2 text-right">GST</th>
                        <th className="py-2 text-right">Total</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item, idx) => (
                        <tr key={idx} className="border-b border-gray-50">
                            <td className="py-2">{item.name}</td>
                            <td className="py-2 text-center">{item.qty}</td>
                            <td className="py-2 text-right">₹{item.price.toFixed(2)}</td>
                            <td className="py-2 text-right">{item.gst}%</td>
                            <td className="py-2 text-right">₹{item.total.toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Summary */}
            <div className="ml-auto w-full max-w-[250px] space-y-2 text-sm">
                <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                    <div className="flex justify-between text-[#FF6B6B]">
                        <span>Discount:</span>
                        <span>-₹{discount.toFixed(2)}</span>
                    </div>
                )}
                <div className="flex justify-between">
                    <span>Total GST:</span>
                    <span>+₹{totalGst.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t-2 border-gray-100 pt-2 font-bold text-lg">
                    <span>GRAND TOTAL:</span>
                    <span>₹{grandTotal.toFixed(2)}</span>
                </div>
            </div>

            {/* Footer */}
            <div className="mt-12 text-center border-t border-gray-100 pt-6">
                <p className="text-sm font-semibold mb-1 italic">Thank you for visiting!</p>
                <p className="text-xs text-gray-500">Follow us on Instagram: @lovebakes</p>
                <p className="text-xs text-gray-400 mt-4">"Satisfaction Guaranteed"</p>

                {/* QR Code Placeholder */}
                <div className="mt-4 inline-block p-2 border border-gray-100 rounded">
                    <div className="w-16 h-16 bg-gray-50 flex items-center justify-center text-[8px] text-gray-300">
                        Digital Menu QR
                    </div>
                </div>
            </div>
        </div>
    );
});

export default InvoiceTemplate;
