'use client';
import Link from 'next/link';
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";

export default function Header() {
    return (
        <header className="bg-white-900 text-gray p-4 px-12 shadow">
            <div className="container mx-auto flex justify-between items-center">
                <Link href="/" className="text-2xl font-bold text-emerald-800">
                    HomeSpace Blog
                </Link>
                <MagnifyingGlassIcon className="h-6 w-6" />
                <nav className="space-x-12 text-sm">
                    <Link href="/">HOME</Link>
                    <Link href="/blogs">BLOG</Link>
                    <Link href="/podcasts">PODCAST</Link>
                    <Link href="/about">ABOUT</Link>
                </nav>
            </div>
        </header>
    );
}
