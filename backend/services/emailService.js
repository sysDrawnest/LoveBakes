import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const sendOrderConfirmationEmail = async (email, name, order) => {
    const itemsHtml = order.items.map(i => `<li>${i.name || 'Item'} × ${i.quantity} — ₹${i.price}</li>`).join('');
    await transporter.sendMail({
        from: `"LoveBakes 🍰" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: `Order Confirmed! #${order._id.toString().slice(-6).toUpperCase()}`,
        html: `
      <div style="font-family:sans-serif;max-width:600px;margin:auto">
        <h2 style="color:#4A332C">Thank you, ${name}! 🎂</h2>
        <p>Your order has been placed successfully.</p>
        <p><strong>Order ID:</strong> ${order._id}</p>
        <h3>Items:</h3><ul>${itemsHtml}</ul>
        <p><strong>Total:</strong> ₹${order.totalPrice}</p>
        <p><strong>Delivery Date:</strong> ${new Date(order.deliveryDate).toLocaleDateString('en-IN')}</p>
        <p>We'll notify you when it's ready. Baked with love! 💕</p>
        <p style="color:#C8B6A6;font-size:12px">LoveBakes — Homemade with Heart</p>
      </div>
    `,
    });

    // Also notify admin
    if (process.env.ADMIN_EMAIL) {
        await transporter.sendMail({
            from: `"LoveBakes System" <${process.env.EMAIL_USER}>`,
            to: process.env.ADMIN_EMAIL,
            subject: `New Order #${order._id.toString().slice(-6).toUpperCase()} from ${name}`,
            html: `<p>New order received from <b>${name}</b> (${email}).<br>Total: ₹${order.totalPrice}<br>Delivery: ${new Date(order.deliveryDate).toLocaleDateString('en-IN')}</p>`,
        });
    }
};
