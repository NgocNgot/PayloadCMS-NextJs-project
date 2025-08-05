'use client';

import React, { useState } from 'react';
import { XMarkIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

interface RegisterModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: (token: string, userId: string) => void;
    onShowLogin?: () => void;
}

export default function RegisterModal({ isOpen, onClose, onSuccess, onShowLogin }: RegisterModalProps) {
    // State variables for form fields
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [gender, setGender] = useState('');
    const [birthdate, setBirthdate] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // State variables for UI feedback
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    // The URL for your Payload CMS server
    const PAYLOAD_SERVER_URL = process.env.NEXT_PUBLIC_API_URL || '';

    // Handle form submission
    const handleRegisterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);

        // Simple client-side validation
        if (password !== confirmPassword) {
            setError('Mật khẩu và xác nhận mật khẩu không khớp.');
            setLoading(false);
            return;
        }

        try {
            // Call the Payload CMS registration API endpoint
            const response = await fetch(`${PAYLOAD_SERVER_URL}/api/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, phone, gender, birthdate, password }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage('Đăng ký thành công! Đang chuyển hướng đến trang đăng nhập...');
                // Automatically log in after successful registration to get a token and user ID
                const loginResponse = await fetch(`${PAYLOAD_SERVER_URL}/api/users/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, password }),
                });

                if (loginResponse.ok) {
                    const loginData = await loginResponse.json();
                    if (onSuccess) {
                        onSuccess(loginData.token, loginData.user.id);
                    }
                    onClose();
                } else {
                    setError('Đăng ký thành công nhưng đăng nhập tự động thất bại.');
                }
            } else {
                // Handle API error messages from Payload
                setError(data.errors?.[0]?.message || data.message || 'Đăng ký thất bại. Vui lòng thử lại.');
            }

        } catch (err) {
            console.error('Registration failed:', err);
            setError('Đã xảy ra lỗi. Vui lòng kiểm tra kết nối mạng và thử lại.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-gray-900/20 bg-opacity-75 flex items-center justify-center z-50 p-4 font-inter">
            <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-lg p-6 relative animate-fade-in-up transform scale-95 md:scale-100 transition-transform duration-300 ease-out">
                {/* Close Button */}
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                    aria-label="Close"
                >
                    <XMarkIcon className="h-6 w-6" />
                </button>

                {/* Title */}
                <h2 className="text-2xl font-bold text-white mb-6 text-center">
                    SIGN UP
                </h2>

                {/* Registration Form */}
                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                    {/* Name Input */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-300 sr-only">
                            Full Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            placeholder="Full Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            disabled={loading}
                        />
                    </div>
                    {/* Email Input */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300 sr-only">
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
                    {/* Phone Input */}
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-300 sr-only">
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            id="phone"
                            placeholder="Phone Number"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                            className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            disabled={loading}
                        />
                    </div>
                    {/* Gender and Birthdate in a single row */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* Gender Select */}
                        <div>
                            <label htmlFor="gender" className="block text-sm font-medium text-gray-300 sr-only">
                                Gender
                            </label>
                            <select
                                id="gender"
                                value={gender}
                                onChange={(e) => setGender(e.target.value)}
                                required
                                className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                disabled={loading}
                            >
                                <option value="" disabled>Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        {/* Birthdate Input */}
                        <div>
                            <label htmlFor="birthdate" className="block text-sm font-medium text-gray-300 sr-only">
                                Birthdate
                            </label>
                            <input
                                type="date"
                                id="birthdate"
                                value={birthdate}
                                onChange={(e) => setBirthdate(e.target.value)}
                                required
                                className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                disabled={loading}
                            />
                        </div>
                    </div>
                    {/* Password and Confirm Password in a single row */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* Password Input */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-300 sr-only">
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
                        {/* Confirm Password Input */}
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 sr-only">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                disabled={loading}
                            />
                        </div>
                    </div>

                    {/* Error and Success Messages */}
                    {error && (
                        <div className="text-red-500 text-sm rounded-md text-left">
                            {error}
                        </div>
                    )}
                    {message && (
                        <div className="text-green-500 text-sm rounded-md text-left">
                            {message}
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-emerald-700 hover:bg-emerald-600 text-white py-3 rounded-md transition-colors duration-200 flex items-center justify-center"
                        disabled={loading}
                    >
                        {loading ? (
                            <ArrowPathIcon className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                            "SIGN UP"
                        )}
                    </button>

                    {/* Link to Login */}
                    <div className="text-center text-sm mt-4 text-gray-400">
                        Already have an account?{' '}
                        <Link
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                onClose();
                                if (onShowLogin) onShowLogin();
                            }}
                            className="text-emerald-500 hover:underline"
                        >
                            Log in
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
