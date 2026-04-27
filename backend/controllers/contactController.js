import nodemailer from 'nodemailer';
import asyncHandler from '../utils/asyncHandler.js';

// @desc    Send contact form message email
// @route   POST /api/contact
// @access  Public
export const sendMessage = asyncHandler(async (req, res) => {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
        res.status(400);
        throw new Error('Please provide name, email, and message');
    }

    // Configure Nodemailer transporter
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD,
        },
    });

    const mailOptions = {
        from: `"${name}" <${email}>`, // sender address
        to: 'sethysaiyangyadatta@gmail.com', // list of receivers
        subject: `LoveBakes Contact: ${subject || 'New Message from Website'}`, // Subject line
        html: `
            <h3>New Contact Message from LoveBakes Website</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong></p>
            <p>${message.replace(/\n/g, '<br>')}</p>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Message sent successfully' });
    } catch (error) {
        console.error('Email send failed:', error);
        res.status(500);
        throw new Error('Failed to send email. Please ensure SMTP credentials are correct.');
    }
});
