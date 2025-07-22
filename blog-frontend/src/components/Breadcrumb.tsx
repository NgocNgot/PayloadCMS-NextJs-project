"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HomeIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface BreadcrumbItem {
    label: string;
    href: string;
}
interface BreadcrumbsProps {
    staticItems?: BreadcrumbItem[];
    dynamicItems?: BreadcrumbItem[];
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ staticItems = [], dynamicItems = [] }) => {
    const pathname = usePathname();
    const pathSegments = pathname.split('/').filter(segment => segment);

    let finalBreadcrumbs: BreadcrumbItem[] = [];
    finalBreadcrumbs.push({ label: 'Home', href: '/' });

    let currentPath = '';
    for (let i = 0; i < pathSegments.length; i++) {
        const segment = pathSegments[i];
        currentPath += `/${segment}`;

        let label = segment.replace(/-/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

        if (segment === 'blogs') {
            label = 'Blogs';
        } else if (segment === 'posts' && i === 0) {
            if (pathSegments.length > 1 && pathSegments[i - 1] !== 'blogs') {
            }
            continue;
        } else if (segment === 'category') {
            continue;
        }
        const isLastPathSegment = i === pathSegments.length - 1;
        const isLikelyDynamicItem = (segment === 'posts' && pathSegments.length > 1) || (segment !== 'blogs' && isLastPathSegment);
        if (segment === 'blogs' || !isLikelyDynamicItem) {
            finalBreadcrumbs.push({ label, href: currentPath });
        }
    }
    dynamicItems.forEach(item => {
        if (!finalBreadcrumbs.some(bc => bc.href === item.href)) {
            finalBreadcrumbs.push(item);
        }
    });

    return (
        <nav aria-label="breadcrumb" className="text-sm mb-6">
            <ol className="flex items-center space-x-0">
                {finalBreadcrumbs.map((item, index) => (
                    <li key={item.href} className="flex items-center hover:text-emerald-800 text-gray-500">
                        {index > 0 && (
                            <ChevronRightIcon className="w-3 h-3 mx-1" />
                        )}
                        {index === 0 ? (
                            <Link href={item.href}>
                                <HomeIcon className="w-4 h-4 mr-1" />
                            </Link>
                        ) : index === finalBreadcrumbs.length - 1 ? (
                            <span className="font-medium text-gray-600">{item.label}</span>
                        ) : (
                            <Link href={item.href}>
                                {item.label}
                            </Link>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
};

export default Breadcrumbs;