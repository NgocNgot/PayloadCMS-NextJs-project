'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import SearchInput from '@/components/SearchInput';

export default function Header() {
    const router = useRouter();
    const handleSearchFromHeader = (query: string) => {
        if (query) {
            router.push(`/?q=${encodeURIComponent(query)}`);
        } else {
            router.push('/');
        }
    };

    return (
        <header className="bg-white-900 text-gray p-4 px-12 shadow">
            <div className="container mx-auto flex justify-between items-center">
                <Link href="/" className="text-2xl font-bold text-emerald-800">
                    HomeSpace Blog
                </Link>
                <SearchInput onSearch={handleSearchFromHeader} />
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
