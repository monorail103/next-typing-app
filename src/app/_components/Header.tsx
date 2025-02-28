import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

"use client";
const Header = () => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`fixed w-full z-50 transition-all duration-300 ${
                scrolled 
                    ? 'bg-white/80 backdrop-blur-md shadow-lg py-2' 
                    : 'bg-transparent py-4'
            }`}
        >
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between">
                    <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                        TypingMaster
                    </Link>
                    
                    <nav>
                        <ul className="flex gap-8">
                            {['ホーム', 'レッスン', 'ランキング', 'マイページ'].map((item, index) => (
                                <motion.li 
                                    key={item}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="relative group"
                                >
                                    <Link href="#" className="font-medium text-gray-700 hover:text-blue-600 transition-colors">
                                        {item}
                                        <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-blue-500 group-hover:w-full transition-all duration-300"></span>
                                    </Link>
                                </motion.li>
                            ))}
                        </ul>
                    </nav>
                    
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-gradient-to-r from-purple-600 to-blue-500 text-white px-6 py-2 rounded-full font-medium shadow-md hover:shadow-lg transition-all"
                    >
                        ログイン
                    </motion.button>
                </div>
            </div>
        </motion.header>
    );
};

export default Header;