'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SearchInput from '@/components/SearchInput';
import LoginModal from '@/components/Login';
import { UserCircleIcon } from '@heroicons/react/24/outline';

export default function Header() {
    const router = useRouter();
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState<string | null>(null);

    const handleSearchFromHeader = (query: string) => {
        if (query) {
            router.push(`/?q=${encodeURIComponent(query)}`);
        } else {
            router.push('/');
        }
    };
    const openLoginModal = () => setIsLoginModalOpen(true);
    const closeLoginModal = () => setIsLoginModalOpen(false);
    const handleLoginSuccess = (token: string, userId: string) => {
        console.log('User logged in with ID:', userId);
        setIsLoggedIn(true);
        closeLoginModal();
    };

    useEffect(() => {
        const token = localStorage.getItem('payload-token');
        if (token) {
            setIsLoggedIn(true);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('payload-token');
        localStorage.removeItem('payload-user-id');
        setIsLoggedIn(false);
        setUserName(null);
        alert("Logged out successfully!");
    };

    return (
        <header className="bg-white-900 text-gray p-4 px-12 shadow">
            <div className="container mx-auto flex justify-between items-center">
                <Link href="/" className="text-2xl font-bold text-emerald-800">
                    HomeSpace Blog
                </Link>
                <SearchInput onSearch={handleSearchFromHeader} />
                <nav className="flex items-center space-x-4 text-sm">
                    <Link href="/">HOME</Link>
                    <Link href="/blogs">BLOG</Link>
                    <Link href="/podcasts">PODCAST</Link>
                    <Link href="/about">ABOUT</Link>
                    {isLoggedIn ? (
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-1 text-gray-600 hover:text-emerald-800 transition-colors duration-200"
                            aria-label="Logout"
                        >
                            <UserCircleIcon className="h-6 w-6" />
                            <span>{userName || 'LOGOUT'}</span>
                        </button>
                    ) : (
                        <button
                            onClick={openLoginModal}
                            className="flex items-center gap-1 text-gray-600 hover:text-emerald-800 transition-colors duration-200"
                            aria-label="Login"
                        >
                            <UserCircleIcon className="h-6 w-6" />
                            <span>LOGIN</span>
                        </button>
                    )}
                </nav>
            </div>
            <LoginModal
                isOpen={isLoginModalOpen}
                onClose={closeLoginModal}
                onLoginSuccess={handleLoginSuccess}
            />
        </header>
    );
}
