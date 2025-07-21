import React from 'react';
import { PostType } from '@/types/Post';
import BlogCard from "../components/BlogCard";
import HomePageType from '@/types/Home';
import Image from 'next/image';
import { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001';
const PAYLOAD_SERVER_URL = process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000';

async function getHomePageData(): Promise<HomePageType | null> {
  try {
    const res = await fetch(`${PAYLOAD_SERVER_URL}/api/pages?where[slug][equals]=home&depth=2`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      console.error(`Failed to fetch homepage data: ${res.status} ${res.statusText}`);
      return null;
    }

    const data = await res.json();
    if (data.docs.length === 0) return null;
    return data.docs[0];
  } catch (error) {
    console.error('Error fetching homepage data:', error);
    return null;
  }
}
async function getPosts(): Promise<PostType[]> {
  const res = await fetch(`${PAYLOAD_SERVER_URL}/api/posts?depth=2`, { cache: 'no-store' });
  const data = await res.json();
  return data.docs;
}

export async function generateMetadata(): Promise<Metadata> {
  const homepageData = await getHomePageData();
  // If homepage data is not found, return default metadata
  const defaultTitle = 'Default Blog Title';
  const defaultDescription = 'Default description for the homepage.';
  const defaultImage = '/default-og-image.jpg';

  const seoTitle = homepageData?.meta?.title || defaultTitle;
  const seoDescription = homepageData?.meta?.description || defaultDescription;
  const seoKeywords = homepageData?.meta?.keywords;
  const seoCanonical = homepageData?.meta?.canonicalURL || SITE_URL;
  const seoImage = homepageData?.meta?.image?.url || homepageData?.hero?.media?.url || defaultImage;

  let finalOgImageUrl: string;
  let finalTwitterImageUrl: string;

  if (homepageData?.meta?.image?.sizes?.og?.url) {
    finalOgImageUrl = `${PAYLOAD_SERVER_URL}${homepageData.meta.image.sizes.og.url}`;
  } else if (seoImage.startsWith('/api/media/')) {
    finalOgImageUrl = `${PAYLOAD_SERVER_URL}${seoImage}`;
  } else if (seoImage.startsWith('/')) {
    finalOgImageUrl = `${SITE_URL}${seoImage}`;
  } else {
    finalOgImageUrl = `${PAYLOAD_SERVER_URL}/api/media/file/${seoImage}`;
  }

  if (homepageData?.meta?.image?.sizes?.twitter?.url) {
    finalTwitterImageUrl = `${PAYLOAD_SERVER_URL}${homepageData.meta.image.sizes.twitter.url}`;
  } else {
    finalTwitterImageUrl = finalOgImageUrl;
  }


  return {
    title: seoTitle,
    description: seoDescription,
    keywords: seoKeywords ? seoKeywords.split(',').map(k => k.trim()) : [],
    alternates: {
      canonical: seoCanonical,
    },
    openGraph: {
      title: homepageData?.meta?.ogTitle || seoTitle,
      description: homepageData?.meta?.ogDescription || seoDescription,
      url: SITE_URL,
      type: 'website',
      images: [
        {
          url: finalOgImageUrl,
          alt: homepageData?.meta?.ogImage?.alt || seoTitle,
          width: homepageData?.meta?.image?.sizes?.og?.width || undefined,
          height: homepageData?.meta?.image?.sizes?.og?.height || undefined,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: homepageData?.meta?.twitterTitle || seoTitle,
      description: homepageData?.meta?.twitterDescription || seoDescription,
      images: [
        {
          url: finalTwitterImageUrl,
          alt: homepageData?.meta?.twitterImage?.alt || seoTitle,
          width: homepageData?.meta?.image?.sizes?.og?.width || undefined,
          height: homepageData?.meta?.image?.sizes?.og?.height || undefined,
        },
      ],
    },
  };
}

export default async function Home() {
  const posts = await getPosts();
  const bannerImageUrl = "https://static.wixstatic.com/media/baac51_d623fe1790ed419a89d20aa05f6064b2.jpg/v1/fill/w_1645,h_650,al_c,q_85,enc_avif,quality_auto/baac51_d623fe1790ed419a89d20aa05f6064b2.jpg";
  const bannerAltText = "Banner";
  const bannerHeading = "DESIGN FOR LIFE";

  return (
    <>
      {/* Banner image */}
      <div className="w-full relative h-[400px]">
        <Image
          src={bannerImageUrl}
          alt={bannerAltText}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 flex justify-center pt-8">
          <h1 className="text-black text-2xl tracking-[0.5em]"><strong>{bannerHeading.split(' ')[0]}</strong> FOR <strong>{bannerHeading.split(' ')[2]}</strong></h1>
        </div>
      </div>

      {/* Blog content */}
      <main className="max-w-5xl mx-auto p-4">
        <section>
          {posts.length === 0 ? (
            <p className="text-center text-gray-500">No posts found.</p>
          ) : (
            posts.map((post) => <BlogCard key={post.id} post={post} />)
          )}
        </section>
      </main>
    </>
  );
}