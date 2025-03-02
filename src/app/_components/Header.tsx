"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { auth, db } from '@/lib/firebaseConfig';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { handleSignOut } from '../_utils/handleSignOut';

const Header: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [username, setUsername] = useState<string | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUser(user);
                const userDocRef = doc(db, 'users', user.uid);
                const userDoc = await getDoc(userDocRef);
                if (userDoc.exists()) {
                    const fetchedUsername = userDoc.data().username;
                    setUsername(fetchedUsername);
                    console.log('User found in Firestore');
                }
                else {
                    console.error('User not found in Firestore');
                }
            } else {
                setUser(null);
                setUsername(null);
            }
        });

        return () => unsubscribe();
    }, []);

    return (
        <header className="relative w-full bg-gradient-to-r from-purple-600 to-blue-500 text-white shadow-lg">
            <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
                {/* Logo with animation */}
                <Link href="/" className="text-2xl font-extrabold tracking-tight hover:scale-105 transition-transform duration-300">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
                    Game App
                </span>
                </Link>

                {/* Navigation Menu */}
                <nav className="hidden md:flex items-center space-x-8">
                <Link href="/about" className="nav-link hover:text-blue-200 transform hover:-translate-y-1 transition-all duration-300">
                    About
                </Link>
                <Link href="/services" className="nav-link hover:text-blue-200 transform hover:-translate-y-1 transition-all duration-300">
                    Services
                </Link>
                <Link href="/contact" className="nav-link hover:text-blue-200 transform hover:-translate-y-1 transition-all duration-300">
                    Contact
                </Link>
                {user ? (
                    <>
                        <button
                            onClick={handleSignOut}
                            className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300"
                        >
                            ログアウト
                        </button>
                        <Link href="/profile" className="flex items-center space-x-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300">
                            <span className="w-8 h-8 bg-white/30 rounded-full flex items-center justify-center">
                            {username?.[0]?.toUpperCase()}
                            </span>
                            <span>{username}さん</span>
                        </Link>
                    </>
                ) : (
                    <>
                    <Link href="/login" className="px-6 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300">
                        ログイン
                    </Link>
                    <Link href="/register" className="px-6 py-2 rounded-full bg-white text-purple-600 hover:bg-blue-100 transition-all duration-300">
                        新規登録
                    </Link>
                    </>
                )}
                </nav>
            </div>
            </div>
        </header>
    );
};

export default Header;