import twilio from 'twilio';

/**
 * Sends a concise but comprehensive order notification to the admin via WhatsApp.
 */
export const sendAdminWhatsAppNotification = async (order, user) => {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromWhatsApp = process.env.TWILIO_WHATSAPP_NUMBER;
    const toWhatsApp = process.env.ADMIN_WHATSAPP_NUMBER;

    if (!accountSid || !authToken || !fromWhatsApp || !toWhatsApp) {
        console.warn('Twilio WhatsApp credentials missing. Skipping WhatsApp notification.');
        return;
    }

    const client = twilio(accountSid, authToken);

    // Format items list
    const itemsList = order.items.map(item =>
        `- ${item.name} (${item.quantity}x) ₹${item.price}${item.size ? ` [${item.size}]` : ''}`
    ).join('\n');

    const address = order.deliveryAddress;
    const fullAddress = `${address.street}, ${address.city}, ${address.state} - ${address.zip}`;

    const messageContent = `*New Order Received! 🍰*
--------------------------
*Order ID:* ${order._id.toString().slice(-6).toUpperCase()}
*Customer:* ${user.name}
*Phone:* ${address.phone}
*Email:* ${user.email}

*Items:*
${itemsList}

*Total Amount:* ₹${order.totalPrice}
*Payment Method:* ${order.paymentMethod.toUpperCase()}
*Payment Status:* ${order.paymentStatus.toUpperCase()}

*Delivery Details:*
*Date:* ${new Date(order.deliveryDate).toLocaleDateString('en-IN')}
*Slot:* ${order.deliveryTime}
*Address:* ${fullAddress}

Baked with love! 💕`;

    try {
        await client.messages.create({
            from: fromWhatsApp,
            to: toWhatsApp,
            body: messageContent,
        });
        console.log('Admin WhatsApp notification sent successfully.');
    } catch (error) {
        console.error('Failed to send WhatsApp notification:', error);
    }
};
