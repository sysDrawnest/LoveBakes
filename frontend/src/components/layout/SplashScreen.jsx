import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const SplashScreen = ({ onComplete }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onComplete();
        }, 2000);
        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <motion.div
            className="fixed inset-0 bg-[#FFFDF9] z-50 flex items-center justify-center"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.8 } }}
        >
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="flex flex-col items-center"
            >
                {/* Placeholder for actual logo. Using stylized text for now */}
                <h1 className="text-5xl md:text-7xl font-bold text-[#4A332C] mb-4">
                    LoveBakes
                </h1>
                <p className="text-[#C8B6A6] text-xl tracking-widest">
                    BAKERY & CAFE
                </p>
            </motion.div>
        </motion.div>
    );
};

export default SplashScreen;
