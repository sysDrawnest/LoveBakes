import nodemailer from 'nodemailer';

const getTransporter = () => nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: process.env.EMAIL_PORT == 465,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

/**
 * Sends a professional order confirmation email to the customer.
 */
export const sendOrderConfirmationEmail = async (email, name, order) => {
    const transporter = getTransporter();

    const itemsHtml = order.items.map(item => `
        <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 10px 0;">
                <div style="font-weight: bold; color: #3B2A25;">${item.name}</div>
                ${item.size ? `<div style="font-size: 12px; color: #666;">Size: ${item.size}</div>` : ''}
                ${item.message ? `<div style="font-size: 12px; color: #E85D75; font-style: italic;">" ${item.message} "</div>` : ''}
            </td>
            <td style="padding: 10px 0; text-align: center;">${item.quantity}</td>
            <td style="padding: 10px 0; text-align: right;">₹${item.price * item.quantity}</td>
        </tr>
    `).join('');

    const address = order.deliveryAddress;
    const fullAddress = `${address.street}, ${address.city}, ${address.state} - ${address.zip}`;

    const customerHtml = `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; color: #333;">
        <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #E85D75; margin: 0;">LoveBakes 🍰</h1>
            <p style="color: #666; font-size: 14px;">Homemade with Heart</p>
        </div>
        
        <h2 style="color: #4A332C;">Thank you for your order, ${name}!</h2>
        <p>Your order has been received and is being processed. Here are your order details:</p>
        
        <div style="background: #FFF6F2; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <table style="width: 100%; border-collapse: collapse;">
                <tr>
                    <td><strong>Order ID:</strong></td>
                    <td style="text-align: right;">#${order._id.toString().slice(-6).toUpperCase()}</td>
                </tr>
                <tr>
                    <td><strong>Date:</strong></td>
                    <td style="text-align: right;">${new Date(order.createdAt).toLocaleDateString('en-IN')} ${new Date(order.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</td>
                </tr>
                <tr>
                    <td><strong>Payment Method:</strong></td>
                    <td style="text-align: right; text-transform: uppercase;">${order.paymentMethod}</td>
                </tr>
                <tr>
                    <td><strong>Payment Status:</strong></td>
                    <td style="text-align: right; text-transform: capitalize;">${order.paymentStatus}</td>
                </tr>
            </table>
        </div>

        <h3 style="border-bottom: 2px solid #E85D75; padding-bottom: 5px; color: #4A332C;">Items Ordered</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <thead>
                <tr style="border-bottom: 2px solid #eee; font-size: 14px; color: #666;">
                    <th style="text-align: left; padding: 10px 0;">Product</th>
                    <th style="text-align: center; padding: 10px 0;">Qty</th>
                    <th style="text-align: right; padding: 10px 0;">Price</th>
                </tr>
            </thead>
            <tbody>
                ${itemsHtml}
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="2" style="padding: 20px 0 5px; text-align: right; color: #666;">Subtotal:</td>
                    <td style="padding: 20px 0 5px; text-align: right;">₹${order.totalPrice - 50}</td>
                </tr>
                <tr>
                    <td colspan="2" style="padding: 5px 0; text-align: right; color: #666;">Delivery Fee:</td>
                    <td style="padding: 5px 0; text-align: right;">₹50</td>
                </tr>
                <tr style="font-size: 18px; font-weight: bold; color: #E85D75;">
                    <td colspan="2" style="padding: 10px 0; text-align: right;">Total:</td>
                    <td style="padding: 10px 0; text-align: right;">₹${order.totalPrice}</td>
                </tr>
            </tfoot>
        </table>

        <div style="margin: 30px 0;">
            <h3 style="border-bottom: 2px solid #E85D75; padding-bottom: 5px; color: #4A332C;">Delivery Information</h3>
            <p style="margin: 5px 0;"><strong>Recipient:</strong> ${address.name}</p>
            <p style="margin: 5px 0;"><strong>Phone:</strong> ${address.phone}</p>
            <p style="margin: 5px 0;"><strong>Slot:</strong> ${order.deliveryTime}</p>
            <p style="margin: 5px 0;"><strong>Date:</strong> ${new Date(order.deliveryDate).toLocaleDateString('en-IN')}</p>
            <p style="margin: 5px 0;"><strong>Address:</strong> ${fullAddress}</p>
        </div>

        <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; color: #999; font-size: 12px;">
            <p>If you have any questions about your order, please contact our support.</p>
            <p>Baked with love by LoveBakes 💕</p>
        </div>
      </div>
    `;

    await transporter.sendMail({
        from: `"LoveBakes 🍰" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: `Order Confirmed! #${order._id.toString().slice(-6).toUpperCase()}`,
        html: customerHtml,
    });

    // Notify Admin with even MORE detail
    if (process.env.EMAIL_USER) {
        const adminHtml = `
            <div style="font-family: sans-serif; border: 2px solid #4A332C; padding: 20px; max-width: 650px; margin: auto;">
                <h2 style="background: #4A332C; color: #fff; padding: 10px; margin-top: 0; text-align: center;">NEW ORDER RECEIVED! 🚀</h2>
                
                <table style="width: 100%; margin-bottom: 20px;">
                    <tr>
                        <td><strong>Order ID:</strong> ${order._id}</td>
                        <td style="text-align: right;"><strong>Status:</strong> ${order.orderStatus.toUpperCase()}</td>
                    </tr>
                </table>

                <div style="background: #f9f9f9; padding: 15px; margin-bottom: 20px;">
                    <h4 style="margin-top: 0; color: #4A332C; border-bottom: 1px solid #ccc;">CUSTOMER DETAILS</h4>
                    <p style="margin: 5px 0;"><b>Name:</b> ${name}</p>
                    <p style="margin: 5px 0;"><b>Email:</b> ${email}</p>
                    <p style="margin: 5px 0;"><b>Phone:</b> ${address.phone}</p>
                </div>

                <div style="background: #f9f9f9; padding: 15px; margin-bottom: 20px;">
                    <h4 style="margin-top: 0; color: #4A332C; border-bottom: 1px solid #ccc;">DELIVERY ADDRESS</h4>
                    <p style="margin: 5px 0;">${fullAddress}</p>
                    <p style="margin: 5px 0;"><b>Date:</b> ${new Date(order.deliveryDate).toLocaleDateString('en-IN')}</p>
                    <p style="margin: 5px 0;"><b>Slot:</b> ${order.deliveryTime}</p>
                </div>

                <h4 style="color: #4A332C;">ORDER ITEMS</h4>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr style="background: #eee;">
                        <th style="padding: 8px; text-align: left;">Item</th>
                        <th style="padding: 8px; text-align: center;">Qty</th>
                        <th style="padding: 8px; text-align: right;">Price</th>
                    </tr>
                    ${itemsHtml}
                    <tr>
                        <td colspan="2" style="padding: 10px; text-align: right;"><b>TOTAL AMOUNT:</b></td>
                        <td style="padding: 10px; text-align: right; color: #E85D75; font-size: 18px;"><b>₹${order.totalPrice}</b></td>
                    </tr>
                </table>

                <p style="margin-top: 20px; font-weight: bold;">Payment Method: <span style="text-transform: uppercase;">${order.paymentMethod}</span></p>
                <p>Payment Status: <span style="text-transform: uppercase;">${order.paymentStatus}</span></p>
                
                <hr>
                <p style="text-align: center; color: #888; font-size: 12px;">LoveBakes Order Management System</p>
            </div>
        `;

        await transporter.sendMail({
            from: `"LoveBakes System" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_USER,
            subject: `🚨 NEW ORDER #${order._id.toString().slice(-6).toUpperCase()} from ${name}`,
            html: adminHtml,
        });
    }
};
