import React from 'react';
import Barcode from 'react-barcode';

const STORE_INFO = {
    name: 'LoveBakes',
    tagline: '🎂 Artisan Bakery & Patisserie',
    address: '123 Bakery Street, City — 400001',
    phone: '+91 98765 43210',
    gst: '23AAAAA0000A1Z5',
    email: 'hello@lovebakes.in',
};

const InvoicePrint = React.forwardRef(({ bill }, ref) => {
    if (!bill) return null;

    const items = Array.isArray(bill.items) ? bill.items : JSON.parse(bill.items || '[]');
    const date = new Date(bill.createdAt || Date.now());
    const dateStr = date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    const timeStr = date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

    return (
        <div ref={ref} style={{ fontFamily: "'Courier New', monospace", maxWidth: 320, margin: '0 auto', padding: '20px 16px', background: '#fff', color: '#222' }}>
            {/* Header */}
            <div style={{ textAlign: 'center', borderBottom: '2px dashed #ccc', paddingBottom: 12, marginBottom: 12 }}>
                <div style={{ fontSize: 22, fontWeight: 'bold', letterSpacing: 2 }}>{STORE_INFO.name}</div>
                <div style={{ fontSize: 11, color: '#555', marginTop: 2 }}>{STORE_INFO.tagline}</div>
                <div style={{ fontSize: 10, marginTop: 4, color: '#444' }}>{STORE_INFO.address}</div>
                <div style={{ fontSize: 10, color: '#444' }}>Ph: {STORE_INFO.phone}</div>
                <div style={{ fontSize: 10, color: '#444' }}>GST: {STORE_INFO.gst}</div>
            </div>

            {/* Bill Info */}
            <div style={{ fontSize: 11, marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span><b>Bill No:</b> {bill.billNumber}</span>
                    <span>{dateStr}</span>
                </div>
                <div style={{ color: '#555', fontSize: 10 }}>{timeStr}</div>
                {bill.customerName && <div style={{ marginTop: 4 }}><b>Customer:</b> {bill.customerName}</div>}
                {bill.customerPhone && <div><b>Phone:</b> {bill.customerPhone}</div>}
            </div>

            {/* Items Header */}
            <div style={{ borderTop: '1px dashed #ccc', borderBottom: '1px dashed #ccc', padding: '6px 0', marginBottom: 6 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 28px 48px 36px 50px', gap: '0 4px', fontSize: 10, fontWeight: 'bold', color: '#555' }}>
                    <span>Item</span>
                    <span style={{ textAlign: 'center' }}>Qty</span>
                    <span style={{ textAlign: 'right' }}>Price</span>
                    <span style={{ textAlign: 'right' }}>Disc</span>
                    <span style={{ textAlign: 'right' }}>Total</span>
                </div>
            </div>

            {/* Items */}
            {items.map((item, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 28px 48px 36px 50px', gap: '0 4px', fontSize: 10, marginBottom: 5, alignItems: 'start' }}>
                    <div>
                        <div style={{ fontWeight: 'bold', lineHeight: 1.3 }}>{item.name}</div>
                        {item.gstRate > 0 && <div style={{ color: '#888', fontSize: 9 }}>GST {item.gstRate}%</div>}
                    </div>
                    <span style={{ textAlign: 'center' }}>{item.qty}</span>
                    <span style={{ textAlign: 'right' }}>₹{item.price}</span>
                    <span style={{ textAlign: 'right' }}>{item.discount > 0 ? `${item.discount}%` : '-'}</span>
                    <span style={{ textAlign: 'right', fontWeight: 600 }}>₹{item.total?.toFixed(2)}</span>
                </div>
            ))}

            {/* Totals */}
            <div style={{ borderTop: '1px dashed #ccc', marginTop: 8, paddingTop: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 3 }}>
                    <span>Subtotal</span>
                    <span>₹{bill.subtotal?.toFixed(2)}</span>
                </div>
                {bill.discountAmt > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#c0392b', marginBottom: 3 }}>
                        <span>Discount</span>
                        <span>- ₹{bill.discountAmt?.toFixed(2)}</span>
                    </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#888', marginBottom: 3 }}>
                    <span>GST ({bill.gstRate}%)</span>
                    <span>₹{bill.gstAmt?.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, fontWeight: 'bold', borderTop: '1px dashed #ccc', paddingTop: 6, marginTop: 4 }}>
                    <span>TOTAL</span>
                    <span>₹{bill.grandTotal?.toFixed(2)}</span>
                </div>
            </div>

            {/* Notes */}
            {bill.notes && (
                <div style={{ fontSize: 10, color: '#666', marginTop: 8, fontStyle: 'italic' }}>Note: {bill.notes}</div>
            )}

            {/* Barcode */}
            <div style={{ textAlign: 'center', marginTop: 14, borderTop: '1px dashed #ccc', paddingTop: 12 }}>
                <Barcode
                    value={bill.billNumber || 'LB/0000/00001'}
                    width={1.4}
                    height={40}
                    fontSize={10}
                    margin={0}
                    displayValue={true}
                />
            </div>

            {/* Footer */}
            <div style={{ textAlign: 'center', fontSize: 10, color: '#888', marginTop: 12, borderTop: '1px dashed #ccc', paddingTop: 10 }}>
                <div style={{ fontSize: 13, marginBottom: 4 }}>🧁 Thank you for visiting LoveBakes! 🧁</div>
                <div>We hope to see you again soon.</div>
                <div style={{ marginTop: 4 }}>{STORE_INFO.email}</div>
            </div>
        </div>
    );
});

InvoicePrint.displayName = 'InvoicePrint';
export default InvoicePrint;
