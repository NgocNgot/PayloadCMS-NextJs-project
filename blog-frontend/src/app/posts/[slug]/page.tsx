import React from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { UserIcon, CalendarIcon } from '@heroicons/react/24/outline';
import { Metadata } from 'next';

import Breadcrumbs from '@/components/Breadcrumb';
import type { PostType } from '@/types/Post';
import type { SerializedEditorState } from '@payloadcms/richtext-lexical';
import { PayloadLexicalReact } from '@zapal/payload-lexical-react';

const SITE_URL = 'http://localhost:3001';
const PAYLOAD_SERVER_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

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

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const postData = await getPostBySlug(params.slug);

    const defaultTitle = 'Default Blog Title';
    const defaultDescription = 'Default description for the blog post.';
    const defaultImage = '/default-og-image.jpg';

    const seoTitle = postData?.meta?.title || postData?.title || defaultTitle;
    const seoDescription = postData?.meta?.description || defaultDescription;
    const seoCanonical = postData?.meta?.canonicalURL || `${SITE_URL}/posts/${params.slug}`;


    const seoImage = postData?.meta?.image?.url || postData?.heroImage?.url || defaultImage;

    let finalOgImageUrl: string;
    let finalTwitterImageUrl: string;

    // Logic to construct absolute image
    if (seoImage.startsWith('/api/media/')) {
        finalOgImageUrl = `${PAYLOAD_SERVER_URL}${seoImage}`;
        finalTwitterImageUrl = `${PAYLOAD_SERVER_URL}${seoImage}`;
    } else if (seoImage.startsWith('/')) {
        finalOgImageUrl = `${SITE_URL}${seoImage}`;
        finalTwitterImageUrl = `${SITE_URL}${seoImage}`;
    } else {
        finalOgImageUrl = `${PAYLOAD_SERVER_URL}/api/media/file/${seoImage}`;
        finalTwitterImageUrl = `${PAYLOAD_SERVER_URL}/api/media/file/${seoImage}`;
    }
    if (postData?.meta?.image?.sizes?.og?.url) {
        finalOgImageUrl = `${PAYLOAD_SERVER_URL}${postData.meta.image.sizes.og.url}`;
    }
    return {
        title: seoTitle,
        description: seoDescription,
        alternates: {
            canonical: seoCanonical,
        },
        openGraph: {
            title: postData?.meta?.ogTitle || seoTitle,
            description: postData?.meta?.ogDescription || seoDescription,
            url: `${SITE_URL}/posts/${params.slug}`,
            type: 'article',
            images: [
                {
                    url: finalOgImageUrl,
                    alt: postData?.meta?.ogImage?.alt || seoTitle,
                    width: postData?.meta?.image?.sizes?.og?.width || undefined,
                    height: postData?.meta?.image?.sizes?.og?.height || undefined,
                },
            ],
            publishedTime: postData?.publishedAt,
            modifiedTime: postData?.updatedAt,
            authors: postData?.populatedAuthors?.map(author => author.name) || [],
        },
        twitter: {
            card: 'summary_large_image',
            title: postData?.meta?.twitterTitle || seoTitle,
            description: postData?.meta?.twitterDescription || seoDescription,
            images: [
                {
                    url: finalTwitterImageUrl,
                    alt: postData?.meta?.twitterImage?.alt || seoTitle,
                    width: postData?.meta?.image?.sizes?.og?.width || undefined,
                    height: postData?.meta?.image?.sizes?.og?.height || undefined,
                },
            ],
        },
    };
}


export default async function PostDetail({ params }: { params: { slug: string } }) {
    const post = await getPostBySlug(params.slug);
    if (!post) return notFound();
    const { title, heroImage, populatedAuthors, publishedAt, content, categories } = post;

    const dynamicBreadcrumbs = [];
    if (categories && categories.length > 0) {
        const primaryCategory = categories[0];
        dynamicBreadcrumbs.push({ label: primaryCategory.title, href: `/blogs` });
    }
    dynamicBreadcrumbs.push({ label: title, href: `/posts/${params.slug}` });

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
        </main>
    );
}