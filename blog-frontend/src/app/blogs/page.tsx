"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumb';
import { PostType } from '@/types/Post';
import BlogCard from '@/components/BlogCard';
import { CategoryType } from '@/types/Category';

const PAYLOAD_SERVER_URL = process.env.NEXT_PUBLIC_API_URL;

// Get all categories
async function getCategoriesClient(): Promise<CategoryType[]> {
    try {
        const res = await fetch(`${PAYLOAD_SERVER_URL}/api/categories`, {
            cache: 'no-store',
        });

        if (!res.ok) {
            console.error(`Failed to fetch categories: ${res.status} ${res.statusText}`);
            return [];
        }

        const data = await res.json();
        return data.docs;
    } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
    }
}

// Get posts by category slug
async function getPostsByCategorySlug(categorySlug: string | null): Promise<PostType[]> {
    try {
        let url = `${PAYLOAD_SERVER_URL}/api/posts?depth=2`;
        if (categorySlug && categorySlug !== 'all') {
            url += `&where[categories.slug][equals]=${categorySlug}`;
        }

        const res = await fetch(url, {
            cache: 'no-store',
        });

        if (!res.ok) {
            console.error(`Failed to fetch posts: ${res.status} ${res.statusText}`);
            return [];
        }

        const data = await res.json();
        return data.docs;
    } catch (error) {
        console.error('Error fetching posts:', error);
        return [];
    }
}

export default function BlogsPage() {
    const [categories, setCategories] = useState<CategoryType[]>([]);
    const [posts, setPosts] = useState<PostType[]>([]);
    const [selectedCategorySlug, setSelectedCategorySlug] = useState<string | null>(null);
    const [loadingCategories, setLoadingCategories] = useState<boolean>(true);
    const [errorCategories, setErrorCategories] = useState<string | null>(null);
    const [errorPosts, setErrorPosts] = useState<string | null>(null);

    // Fetch categories
    useEffect(() => {
        async function fetchCategories() {
            setLoadingCategories(true);
            setErrorCategories(null);
            try {
                const data = await getCategoriesClient();
                setCategories(data);
            } catch (err: any) {
                setErrorCategories(err.message || 'Failed to fetch categories.');
            } finally {
                setLoadingCategories(false);
            }
        }
        fetchCategories();
    }, []);

    // Fetch posts
    useEffect(() => {
        async function fetchPosts() {
            setErrorPosts(null);
            try {
                const data = await getPostsByCategorySlug(selectedCategorySlug);
                setPosts(data);
            } catch (err: any) {
                setErrorPosts(err.message || 'Failed to fetch posts.');
            }
        }
        fetchPosts();
    }, [selectedCategorySlug]);

    const currentCategory = categories.find(cat => cat.slug === selectedCategorySlug);
    const dynamicBreadcrumbs = selectedCategorySlug && currentCategory
        ? [{ label: currentCategory.title, href: `/blogs/category/${selectedCategorySlug}` }]
        : [];

    return (
        <div className="container max-w-5xl mx-auto">
            <div className="pt-4">
                <Breadcrumbs
                    dynamicItems={dynamicBreadcrumbs}
                />
            </div>
            <nav className=" flex items-center gap-8 justify-start  pb-4 text-gray-700 cursor-pointer text-base">
                <p
                    onClick={() => setSelectedCategorySlug(null)}
                    className={`${selectedCategorySlug === null ? "text-emerald-800 border-b-2 border-emerald-400/20 font-semibold" : ""}`}
                >
                    All Posts
                </p>
                {loadingCategories ? (
                    <p className="text-gray-500">Loading...</p>
                ) : errorCategories ? (

                    <p className="text-red-500">
                        Error: {errorCategories}.
                    </p>

                ) : (
                    categories.map((category) => (
                        <p key={category.id}>
                            <button
                                onClick={() => setSelectedCategorySlug(category.slug)}
                                className={`
                                    ${selectedCategorySlug === category.slug ? "text-emerald-800 border-b-2 border-emerald-400/20 font-semibold" : ""}`}
                            >
                                {category.title}
                            </button>
                        </p>
                    ))
                )}
            </nav>

            {/* List blog */}
            <main>
                <section>
                    {posts.length === 0 ? (
                        <p className="text-center text-red-500 text-lg">
                            No posts found in this category.
                        </p>
                    ) : (
                        <div className="grid grid-cols-1">
                            {posts.map((post) => (
                                <BlogCard key={post.id} post={post} />
                            ))}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}