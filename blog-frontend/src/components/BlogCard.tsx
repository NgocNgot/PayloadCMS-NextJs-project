'use client';
import { useState } from 'react';
import { PostType } from '@/types/Post';
import Link from 'next/link';
import Image from 'next/image';
import {
    UserIcon,
    CalendarIcon,
    ClockIcon,
    EyeIcon,
    ChatBubbleBottomCenterTextIcon,
    HeartIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";


interface BlogCardProps {
    post: PostType;
}

export default function BlogCard({ post }: BlogCardProps) {
    const { title, slug, publishedAt, populatedAuthors, heroImage, content } = post;
    const [currentHearts, setCurrentHearts] = useState(post.hearts || 0);
    const [isHeartFilled, setIsHeartFilled] = useState(false);

    const getSummary = (): string => {
        try {
            const paragraph = content?.root?.children.find((c) => c.type === 'paragraph');
            const texts = paragraph?.children?.map((child) => child.text).join(' ') || '';
            return texts.length > 200 ? texts.slice(0, 200) + '...' : texts;
        } catch {
            return '';
        }
    };
    const getTimeDifference = (publishDate: string): string => {
        const published = new Date(publishDate);
        const now = new Date();
        const diffInMilliseconds = now.getTime() - published.getTime();

        const minutes = Math.floor(diffInMilliseconds / (1000 * 60));
        const hours = Math.floor(diffInMilliseconds / (1000 * 60 * 60));
        const days = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));

        if (days > 0) {
            return `${days} day${days > 1 ? 's' : ''} ago`;
        } else if (hours > 0) {
            return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        } else if (minutes > 0) {
            return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        } else {
            return "Just now";
        }
    };

    const handleHeartClick = async () => {
        if (isHeartFilled) {
            return;
        }
        setCurrentHearts(prevHearts => prevHearts + 1);
        setIsHeartFilled(true);
        try {
            const updateResponse = await fetch(`http://localhost:3000/api/posts/${post.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    hearts: currentHearts + 1,
                }),
            });

            if (!updateResponse.ok) {
                console.error(`HTTP error! status: ${updateResponse.status}`);
                throw new Error(`Failed to update hearts: ${updateResponse.statusText}`);
            }

            const updatedPost = await updateResponse.json();
            console.log('The number of hearts has been updated:', updatedPost.hearts);

        } catch (error) {
            console.error('Error increase hearts:', error);
            setCurrentHearts(prevHearts => prevHearts - 1);
            setIsHeartFilled(false);
        }
    };

    return (
        <div className="flex border-1 border-gray-300 mb-10">
            {/* Image Section */}
            <div className="w-1/2">
                {heroImage?.thumbnailURL && (
                    <Image
                        src={`http://localhost:3000${heroImage.thumbnailURL}`}
                        alt={heroImage.alt || 'Thumbnail'}
                        width={heroImage?.sizes?.thumbnail?.width || 400}
                        height={heroImage?.sizes?.thumbnail?.height || 250}
                        className="w-full h-full object-cover"
                    />
                )}
            </div>

            {/* Text Content */}
            <div className="w-1/2 p-6 flex flex-col justify-between">
                <div>
                    <div className="text-sm text-gray-500 mb-1 flex items-center space-x-4">
                        <span className="flex items-center gap-1">
                            <UserIcon className="w-4 h-4" />
                            {populatedAuthors?.[0]?.name || 'Unknown'}
                        </span>
                        <span className="flex items-center gap-1">
                            <CalendarIcon className="w-4 h-4" />
                            {new Date(publishedAt).toLocaleDateString('en-US')}
                        </span>
                        <span className="flex items-center gap-1">
                            <ClockIcon className="w-4 h-4" />
                            {getTimeDifference(publishedAt)}
                        </span>
                    </div>

                    <h2 className="text-2xl font-light uppercase tracking-wide mb-3 font-stretch-95%">
                        <Link href={`/posts/${slug}`} className="hover:underline">
                            {title}
                        </Link>
                    </h2>

                    <p className="text-gray-700 text-base">{getSummary()}</p>
                </div>

                <div className="text-xs text-gray-500 mt-4 flex justify-between border-t pt-2">
                    <div className="flex gap-4">
                        <span className="flex items-center gap-1">
                            <EyeIcon className="w-4 h-4" /> 0 views
                        </span>
                        <span className="flex items-center gap-1">
                            <ChatBubbleBottomCenterTextIcon className="w-4 h-4" /> 0 comments
                        </span>
                    </div>
                    <button
                        onClick={handleHeartClick}
                        className="flex items-center gap-1 cursor-pointer transition-colors duration-200"
                        aria-label="Favorite Post"
                    >
                        {isHeartFilled ? (
                            <HeartIconSolid className="w-4 h-4 text-red-500" />
                        ) : (
                            <HeartIcon className="w-4 h-4 text-gray-500 hover:text-red-500" />
                        )}
                        {currentHearts}
                    </button>
                </div>

            </div>
        </div>
    );
}
