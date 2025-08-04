"use client";
import React, { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { UserIcon, CalendarIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { ChatBubbleBottomCenterTextIcon } from '@heroicons/react/24/solid';

import Breadcrumbs from '@/components/Breadcrumb';
import type { PostType } from '@/types/Post';
import type { CommentType } from '@/types/Comment';
import { User } from '@/types/User';
import type { SerializedEditorState } from '@payloadcms/richtext-lexical';
import { PayloadLexicalReact } from '@zapal/payload-lexical-react';

const PAYLOAD_SERVER_URL = process.env.NEXT_PUBLIC_API_URL || '';
async function getPostBySlug(slug: string): Promise<PostType | null> {
    try {
        const res = await fetch(`${PAYLOAD_SERVER_URL}/api/posts?where[slug][equals]=${slug}&depth=2`, {
            next: { revalidate: 60 },
        });

        if (!res.ok) {
            console.error(`Failed to fetch post data for slug "${slug}": ${res.status} ${res.statusText}`);
            return null;
        }

        const data = await res.json();
        return data.docs?.[0] || null;
    } catch (err) {
        console.error('Error fetching post:', err);
        return null;
    }
}

async function getCommentsForPost(postId: string): Promise<CommentType[]> {
    try {
        const res = await fetch(`${PAYLOAD_SERVER_URL}/api/comments?where[post][equals]=${postId}&depth=1&sort=-createdAt`);
        if (!res.ok) {
            console.error(`Failed to fetch comments for post ${postId}: ${res.status} ${res.statusText}`);
            return [];
        }
        const data = await res.json();
        return data.docs || [];
    } catch (err) {
        console.error('Error fetching comments:', err);
        return [];
    }
}

export default function PostDetailPage({ params }: { params: { slug: string } }) {
    const [postData, setPostData] = useState<PostType | null>(null);
    const [comments, setComments] = useState<CommentType[]>([]);
    const [newCommentText, setNewCommentText] = useState('');
    const [commentLoading, setCommentLoading] = useState(false);
    const [commentError, setCommentError] = useState<string | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const fetchPostAndComments = async () => {
            const post = await getPostBySlug(params.slug);
            setPostData(post);
            if (post) {
                const fetchedComments = await getCommentsForPost(post.id);
                setComments(fetchedComments);
            } else {
                notFound();
            }
        };
        fetchPostAndComments();
        const token = typeof window !== 'undefined' ? localStorage.getItem('payload-token') : null;
        setIsLoggedIn(!!token);
    }, [params.slug]);

    if (!postData) {
        return (
            <main className="container mx-auto pt-8 text-center text-gray-600">
                Loading...
            </main>
        );
    }

    const { title, publishedAt, populatedAuthors, heroImage, content } = postData;

    const dynamicBreadcrumbs = [
        { label: 'Blog', href: '/blogs' },
        { label: title, href: `/posts/${postData.slug}` },
    ];

    const handleCommentSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setCommentLoading(true);
        setCommentError(null);

        const token = localStorage.getItem('payload-token');
        const userId = localStorage.getItem('payload-user-id');

        if (!token || !userId) {
            setCommentError("You should be logged in to comment.");
            setCommentLoading(false);
            return;
        }

        if (!newCommentText.trim()) {
            setCommentError("Comment text is required.");
            setCommentLoading(false);
            return;
        }

        try {
            const response = await fetch(`${PAYLOAD_SERVER_URL}/api/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `JWT ${token}`,
                },
                body: JSON.stringify({
                    commentText: newCommentText,
                    post: postData.id,
                    author: userId,
                }),
            });

            if (response.ok) {
                const newCommentResponse = await response.json();
                const authorInfo = { id: userId, name: newCommentResponse.doc.author.name || 'Bạn' } as User;

                setComments(prevComments => [
                    { ...newCommentResponse.doc, author: authorInfo },
                    ...prevComments,
                ]);
                setNewCommentText('');
                alert("Comment successfully!");
            } else {
                const errorData = await response.json();
                setCommentError(errorData.message || "Comment failed.");
            }
        } catch (error: any) {
            console.error("Error submitting comment:", error);
            setCommentError(error.message || 'Error comment.');
        } finally {
            setCommentLoading(false);
        }
    };
    return (
        <main className="max-w-5xl mx-auto pt-4">
            <div className="mb-4">
                <Breadcrumbs
                    dynamicItems={dynamicBreadcrumbs}
                />
            </div>
            <h1 className="text-3xl font-bold uppercase tracking-wide mb-4">{title}</h1>

            <div className="text-gray-500 text-sm mb-6 flex items-center gap-4">
                <span className="flex items-center gap-1">
                    <UserIcon className="w-4 h-4" />
                    {populatedAuthors?.[0]?.name || 'Unknown'}
                </span>
                <span className="flex items-center gap-1">
                    <CalendarIcon className="w-4 h-4" />
                    {new Date(publishedAt).toLocaleDateString('en-US')}
                </span>
            </div>

            {heroImage?.url && (
                <div className="relative w-full h-96 mb-6 overflow-hidden">
                    <Image
                        src={`${PAYLOAD_SERVER_URL}${heroImage.url.startsWith('/') ? heroImage.url : '/' + heroImage.url}`}
                        alt={heroImage?.alt || 'Post image'}
                        fill
                        className="object-cover"
                        priority
                    />
                </div>
            )}
            <article className="prose max-w-none text-lg">
                {content && <PayloadLexicalReact content={content as SerializedEditorState} />}
            </article>

            {/* Comment Section */}
            <section className="mt-12 p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                    <ChatBubbleBottomCenterTextIcon className="w-6 h-6 text-emerald-600" /> Comment ({comments.length})
                </h2>

                {/* Comment Form */}
                <div className="mb-8">
                    {isLoggedIn ? (
                        <form onSubmit={handleCommentSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="commentText" className="sr-only">Your comment</label>
                                <textarea
                                    id="commentText"
                                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                                    rows={4}
                                    placeholder="Write your comment here..."
                                    value={newCommentText}
                                    onChange={(e) => setNewCommentText(e.target.value)}
                                    disabled={commentLoading}
                                    required
                                ></textarea>
                            </div>
                            {commentError && (
                                <p className="text-red-500 text-sm">{commentError}</p>
                            )}
                            <button
                                type="submit"
                                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-md transition-colors flex items-center justify-center"
                                disabled={commentLoading}
                            >
                                {commentLoading ? (
                                    <ArrowPathIcon className="w-4 h-4 mr-2 animate-spin" />
                                ) : (
                                    "Comment"
                                )}
                            </button>
                        </form>
                    ) : (
                        <p className="text-gray-600 text-center py-4 border border-gray-200 rounded-md">
                            Please <Link href="/login" className="text-emerald-600 hover:underline">log in</Link> to comment.
                        </p>
                    )}
                </div>

                {/* Comments List */}
                <div>
                    {comments.length === 0 ? (
                        <p className="text-gray-500 text-center py-4">No comments. Be the first to comment!</p>
                    ) : (
                        <div className="space-y-6">
                            {comments.map((comment) => (
                                <div key={comment.id} className="bg-gray-50 p-4 rounded-lg shadow-sm">
                                    <div className="flex items-center space-x-3 mb-2">
                                        <UserIcon className="w-5 h-5 text-gray-500" />
                                        <p className="font-semibold text-gray-800">
                                            {(comment.author as User)?.name || (comment.author as any)?.email || 'Ẩn danh'}
                                        </p>
                                        <p className="text-gray-500 text-sm">
                                            {new Date(comment.createdAt).toLocaleString()}
                                        </p>
                                    </div>
                                    <p className="text-gray-700 text-base leading-relaxed">
                                        {comment.commentText}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}