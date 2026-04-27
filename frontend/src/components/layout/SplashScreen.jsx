import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import logo from '../../assets/logo.png';

const SplashScreen = ({ onComplete }) => {

    useEffect(() => {
        const timer = setTimeout(() => {
            onComplete();
        }, 2000);

        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <motion.div
            className="fixed inset-0 bg-[#FFF6F2] z-50 flex items-center justify-center"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.8 } }}
        >
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="flex items-center justify-center"
            >

                {/* Bigger Logo */}
                <img
                    src={logo}
                    alt="LoveBakes Logo"
                    className="w-72 md:w-96"
                />

            </motion.div>
        </motion.div>
    );
};

export default SplashScreen;