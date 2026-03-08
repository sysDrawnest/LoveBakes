/**
 * Create Admin User
 * Run: node createAdmin.js
 * 
 * This creates an admin account you can use to login at /admin
 */
import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import User from './models/User.js';

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB Atlas');

        // Admin credentials — change these before running!
        const ADMIN_EMAIL = 'admin@lovebakes.in';
        const ADMIN_PASSWORD = 'lovebakes2026';
        const ADMIN_NAME = 'LoveBakes Admin';

        const existing = await User.findOne({ email: ADMIN_EMAIL });
        if (existing) {
            // If user exists, upgrade to admin
            existing.role = 'admin';
            await existing.save();
            console.log(`✅ Upgraded existing user to admin: ${ADMIN_EMAIL}`);
        } else {
            await User.create({
                name: ADMIN_NAME,
                email: ADMIN_EMAIL,
                password: ADMIN_PASSWORD,
                role: 'admin',
            });
            console.log(`✅ Admin created!`);
        }

        console.log(`\n--- Admin Login Credentials ---`);
        console.log(`Email:    ${ADMIN_EMAIL}`);
        console.log(`Password: ${ADMIN_PASSWORD}`);
        console.log(`\nGo to: http://localhost:5173/login`);
        console.log(`After login, visit: http://localhost:5173/admin`);
        process.exit(0);
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
};

createAdmin();
