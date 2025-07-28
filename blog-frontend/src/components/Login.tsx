'use client';

import React, { useState } from 'react';
import { XMarkIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLoginSuccess?: (token: string, userId: string) => void;
}

export default function LoginModal({ isOpen, onClose, onLoginSuccess }: LoginModalProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const PAYLOAD_SERVER_URL = process.env.NEXT_PUBLIC_API_URL || '';
    // Send form login
    const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${PAYLOAD_SERVER_URL}/api/users/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const data = await response.json();
                const token = data.token;
                const userId = data.user.id;

                localStorage.setItem('payload-token', token);
                localStorage.setItem('payload-user-id', userId);

                onLoginSuccess?.(token, userId);
                setEmail('');
                setPassword('');
                onClose();
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Email or password incorrect.');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('An error occurred during login. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-900/20 bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6 relative animate-fade-in-up transform scale-95 md:scale-100 transition-transform duration-300 ease-out">
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                    aria-label="Đóng"
                >
                    <XMarkIcon className="h-6 w-6" />
                </button>

                <h2 className="text-2xl font-bold text-white mb-6 text-center">
                    LOGIN
                </h2>

                <form onSubmit={handleLoginSubmit} className="space-y-4">
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-300 sr-only"
                        >
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            disabled={loading}
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-300 sr-only"
                        >
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            disabled={loading}
                        />
                    </div>
                    {error && (
                        <div className="text-red-500 text-sm rounded-md text-left">
                            {error}
                        </div>
                    )}
                    <button
                        type="submit"
                        className="w-full bg-emerald-700 hover:bg-emerald-600 text-white py-3 rounded-md transition-colors duration-200 flex items-center justify-center"
                        disabled={loading}
                    >
                        {loading ? (
                            <ArrowPathIcon className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                            "SIGN IN"
                        )}
                    </button>
                    <Link
                        href="/forgot-password"
                        className="text-center text-sm text-gray-400 mt-4 hover:underline"
                    >
                        Forgot password?
                    </Link>
                </form>
            </div>
        </div>
    );
}
