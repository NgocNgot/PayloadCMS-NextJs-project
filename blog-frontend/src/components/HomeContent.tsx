'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { PostType } from '@/types/Post';
import BlogCard from "./BlogCard";
import Image from 'next/image';
import { fetchPostsBasedOnQuery } from '../lib/fetchPosts';

export default function HomeContent() {
    const searchParams = useSearchParams();
    const currentSearchQuery = searchParams.get('q') || '';

    const [displayedPosts, setDisplayedPosts] = useState<PostType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const posts = await fetchPostsBasedOnQuery(currentSearchQuery);
                setDisplayedPosts(posts);
            } catch (err) {
                console.error("Failed to fetch data:", err);
                setError("Failed to load content. Please try again later.");
                setDisplayedPosts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [currentSearchQuery]);

    const bannerImageUrl = "https://static.wixstatic.com/media/baac51_d623fe1790ed419a89d20aa05f6064b2.jpg/v1/fill/w_1645,h_650,al_c,q_85,enc_avif,quality_auto/baac51_d623fe1790ed419a89d20aa05f6064b2.jpg";
    return (
        <>
            {!currentSearchQuery && (
                <div className="w-full relative h-[400px]">
                    <Image
                        src={bannerImageUrl}
                        alt="Banner"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 flex justify-center pt-8">
                        <h1 className="text-black text-2xl tracking-[0.5em]">
                            <strong>DESIGN</strong> FOR <strong>LIFE</strong>
                        </h1>
                    </div>
                </div>
            )}

            {/* Blog Content */}
            <main className="max-w-5xl mx-auto p-4">
                <section>
                    {loading ? (
                        <p className="text-center text-gray-500">Loading...</p>
                    ) : error ? (
                        <p className="text-center text-red-500">{error}</p>
                    ) : displayedPosts.length === 0 ? (
                        <p className="text-center text-gray-500">
                            {currentSearchQuery
                                ? `Not found any posts with the search "${currentSearchQuery}".`
                                : "Not found any posts."}
                        </p>
                    ) : (
                        <>
                            {currentSearchQuery && (
                                <h2 className="text-xl font-semibold mb-6">
                                    Search results for <i>{currentSearchQuery}</i>
                                </h2>
                            )}
                            {displayedPosts.map((post) => (
                                <BlogCard key={post.id} post={post} />
                            ))}
                        </>
                    )}
                </section>
            </main>
        </>
    );
}
