'use client';

import React, { useState, useEffect } from 'react';
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";

interface SearchInputProps {
    initialQuery?: string;
    onSearch: (query: string) => void;
}

export default function SearchInput({ initialQuery = '', onSearch }: SearchInputProps) {
    const [searchQuery, setSearchQuery] = useState(initialQuery);
    useEffect(() => {
        setSearchQuery(initialQuery);
    }, [initialQuery]);
    const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSearch(searchQuery.trim());
    };

    return (
        <form
            onSubmit={handleSearchSubmit}
            className="relative flex items-center"
        >
            <input
                type="text"
                placeholder="Search post..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-100 py-2 px-4 pr-10 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 transition-all duration-200"
            />
            <button
                type="submit"
                aria-label="Search"
                className="absolute right-0 top-0 mt-2 mr-2 text-gray-500 hover:text-emerald-700 transition-colors duration-200"
            >
                <MagnifyingGlassIcon className="h-6 w-6" />
            </button>
        </form>
    );
}
