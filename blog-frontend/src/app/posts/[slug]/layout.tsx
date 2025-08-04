import React from 'react';
import { generatePostMetadata } from '@/seo/PostSEO';
export const generateMetadata = generatePostMetadata;

export default function PostLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            {children}
        </>
    );
}
