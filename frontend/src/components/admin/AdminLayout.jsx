import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNav from './TopNav';
import { motion } from 'framer-motion';

const AdminLayout = () => {
    return (
        <div className="flex flex-col lg:flex-row min-h-screen bg-slate-50">
            {/* Sidebar for Desktop / TopNav for Mobile */}
            <Sidebar />
            <TopNav />

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0 bg-slate-50">
                <div className="p-4 md:p-8 lg:p-10 max-w-7xl mx-auto w-full">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                    >
                        <Outlet />
                    </motion.div>
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
