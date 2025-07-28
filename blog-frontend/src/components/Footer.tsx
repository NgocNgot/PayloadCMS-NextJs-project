'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { LinkIcon, XMarkIcon } from '@heroicons/react/24/outline';
const CONTACT_FORM_ID = '688744584df57d257b603315';
const PAYLOAD_SERVER_URL = process.env.NEXT_PUBLIC_API_URL || '';
export default function Footer() {
    const [showForm, setShowForm] = useState(false);
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubscribeClick = () => {
        setShowForm(true);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("Email: ", email);
        console.log("Message:", message);
        try {
            const getResponse = await fetch(`${PAYLOAD_SERVER_URL}/api/forms/${CONTACT_FORM_ID}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                cache: 'no-store',
            });

            if (!getResponse.ok) {
                const errorData = await getResponse.json();
                throw new Error(`Failed to fetch form data: ${errorData.message || getResponse.statusText}`);
            }

            const currentForm = await getResponse.json();
            const existingSubmissions = Array.isArray(currentForm.submissions) ? currentForm.submissions : [];
            // Creat submission in Contact Form Submission
            const newSubmission = {
                submittedAt: new Date().toISOString(),
                data: {
                    email: email,
                    message: message,
                },
            };
            const updatedSubmissions = [...existingSubmissions, newSubmission];

            const patchResponse = await fetch(`${PAYLOAD_SERVER_URL}/api/forms/${CONTACT_FORM_ID}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    submissions: updatedSubmissions,
                }),
            });

            if (patchResponse.ok) {
                alert("Thank you for contacting us. Your message has been sent!");
                setEmail('');
                setMessage('');
                setShowForm(false);
            } else {
                const errorData = await patchResponse.json();
                console.error("Patch form submission failed: ", errorData);
                alert(
                    `Message could not be sent. Error: ${errorData.message || patchResponse.statusText}`
                );
            }
        } catch (error) {
            console.error("Error sent form submission: ", error);
            alert("Error sending your message. Please try again.");
        }
    };

    return (
        <footer className="bg-gray-800 text-white py-6 px-4">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center md:items-start space-y-8 md:space-y-0 md:space-x-8">

                {/* Left Section */}
                <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-4 md:w-1/2">
                    <div className="flex space-x-4">
                        <Link href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                            <LinkIcon className="h-6 w-6 text-xl hover:text-emerald-500 transition-colors" />
                        </Link>
                        <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                            <LinkIcon className="h-6 w-6 text-xl hover:text-emerald-500 transition-colors" />
                        </Link>
                        <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                            <LinkIcon className="h-6 w-6 text-xl hover:text-emerald-500 transition-colors" />
                        </Link>
                        <Link href="https://pinterest.com" target="_blank" rel="noopener noreferrer" aria-label="Pinterest">
                            <LinkIcon className="h-6 w-6 text-xl hover:text-emerald-500 transition-colors" />
                        </Link>
                    </div>
                    <div className="text-gray-400 text-base mt-4">
                        Design for Life.
                    </div>
                </div>

                {/* Right Section */}
                <div className="flex-1 w-full flex flex-col items-center md:items-start space-y-4 md:w-1/2">
                    <h3 className="text-2xl tracking-[0.25em] font-mediumtext-center md:text-left">CONTACT</h3>
                    {!showForm ? (
                        <button
                            onClick={handleSubscribeClick}
                            className="bg-emerald-700 hover:bg-emerald-600 text-white font-bold py-2 px-6 rounded-full transition-colors duration-200"
                        >
                            Subscribe
                        </button>
                    ) : (
                        <form onSubmit={handleSubmit} className="w-full space-y-4 relative">
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="absolute -top-3 -right-3 bg-gray-700 text-white rounded-full p-1 hover:bg-gray-600 transition-colors"
                                aria-label="Close form"
                            >
                                <XMarkIcon className="h-5 w-5" />
                            </button>
                            <div>
                                <label htmlFor="email" className="sr-only">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    placeholder="Your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full p-3 rounded bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                            </div>
                            <div>
                                <label htmlFor="message" className="sr-only">Message</label>
                                <textarea
                                    id="message"
                                    placeholder="Your message"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    rows={4}
                                    required
                                    className="w-full p-3 rounded bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-emerald-700 hover:bg-emerald-600 text-white font-bold py-2 rounded transition-colors duration-200"
                            >
                                SEND
                            </button>
                        </form>
                    )}
                </div>
            </div>
            <hr className="border-gray-700 my-4" />
            {/* Bottom Copyright */}
            <div className="text-gray-400 text-xs text-center">
                © {new Date().getFullYear()} by Design for Life.
            </div>
        </footer>
    );
}
