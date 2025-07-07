import React from 'react';
import { PostType } from '@/types/Post';
import BlogCard from "../components/BlogCard";
import Image from 'next/image';

async function getPosts(): Promise<PostType[]> {
  const res = await fetch('http://localhost:3000/api/posts?depth=2', { cache: 'no-store' });
  const data = await res.json();
  return data.docs;
}

export default async function Home() {
  const posts = await getPosts();
  return (
    <>
      {/* Banner image */}
      <div className="w-full relative h-[400px]">
        <Image
          src="https://static.wixstatic.com/media/baac51_d623fe1790ed419a89d20aa05f6064b2.jpg/v1/fill/w_1645,h_650,al_c,q_85,enc_avif,quality_auto/baac51_d623fe1790ed419a89d20aa05f6064b2.jpg"
          alt="Banner"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 flex justify-center pt-8">
          <h1 className="text-black text-2xl tracking-[0.5em]"><strong>DESIGN</strong> FOR <strong>LIFE</strong></h1>
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
