import React from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { UserIcon, CalendarIcon } from '@heroicons/react/24/outline';

import type { PostType } from '@/types/Post';
import type { SerializedEditorState } from '@payloadcms/richtext-lexical';
import { PayloadLexicalReact } from '@zapal/payload-lexical-react';

async function getPostBySlug(slug: string): Promise<PostType | null> {
    try {
        const res = await fetch(`http://localhost:3000/api/posts?where[slug][equals]=${slug}&depth=2`, {
            cache: 'no-store',
        });
        const data = await res.json();
        return data.docs?.[0] || null;
    } catch (err) {
        console.error('Failed to fetch post:', err);
        return null;
    }
}

export default async function PostDetail({ params }: { params: { slug: string } }) {
    const post = await getPostBySlug(params.slug);

    if (!post) return notFound();

    const { title, heroImage, populatedAuthors, publishedAt, content } = post;

    return (
        <main className="max-w-4xl mx-auto px-4 py-8">
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
                <Image
                    src={`http://localhost:3000${heroImage.url}`}
                    alt={heroImage?.alt || 'Post image'}
                    width={800}
                    height={500}
                    className="rounded mb-6 w-full object-cover"
                />
            )}

            <article className="prose max-w-none text-lg">
                {content && <PayloadLexicalReact content={content as SerializedEditorState} />}
            </article>
        </main>
    );
}
